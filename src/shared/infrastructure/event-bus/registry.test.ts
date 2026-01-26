// tests/registry.test.ts
import fs from 'node:fs';
import path from 'node:path';
import { registerSubscribersFromModules } from './registry';
import { PubSub } from 'graphql-subscriptions';
import { eventBus } from './RxjsEventBus';

jest.mock('node:fs');
jest.mock('node:path');
jest.mock('./RxjsEventBus', () => ({
    eventBus: { subscribe: jest.fn() }
}));

const mockPubSub = {} as PubSub;

describe('registerSubscribersFromModules', () => {
    const baseDir = '/base';
    const modulesDir = '/base/src/modules';
    const mod1SubDir = '/base/src/modules/mod1/infrastructure/subscribers';
    const subscriberFilePath = `${mod1SubDir}/OrderCreatedSubscriber.ts`;
    const multiFilePath = `${mod1SubDir}/MultiSubscriber.ts`;
    const funcFilePath = `${mod1SubDir}/FuncSubscriber.ts`;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();

        // path.join simply concatenates with '/'
        (path.join as jest.Mock).mockImplementation((...args: string[]) => args.join('/'));
    });

    afterEach(() => {
        // cleanup virtual module mocks so they don't leak between tests
        try {
            // @ts-ignore
            delete require.cache[require.resolve(subscriberFilePath)];
        } catch { }
        try {
            // @ts-ignore
            delete require.cache[require.resolve(multiFilePath)];
        } catch { }
        try {
            // @ts-ignore
            delete require.cache[require.resolve(funcFilePath)];
        } catch { }
    });

    it('should return if modules directory does not exist', () => {
        (fs.existsSync as jest.Mock).mockImplementation((_p: string) => false);

        registerSubscribersFromModules(baseDir, mockPubSub);

        expect(fs.existsSync).toHaveBeenCalledWith(modulesDir);
        expect(fs.readdirSync).not.toHaveBeenCalled();
    });

    it('should not register anything if no modules are present', () => {
        (fs.existsSync as jest.Mock).mockImplementation((p: string) => p === modulesDir);
        (fs.readdirSync as jest.Mock).mockReturnValue([]);

        registerSubscribersFromModules(baseDir, mockPubSub);

        expect(fs.readdirSync).toHaveBeenCalledWith(modulesDir, { withFileTypes: true });
        expect((eventBus.subscribe as jest.Mock)).not.toHaveBeenCalled();
    });

    it('should not register if subscribers directory does not exist', () => {
        // modules dir exists and contains one module folder
        (fs.existsSync as jest.Mock).mockImplementation((p: string) => p === modulesDir);
        (fs.readdirSync as jest.Mock).mockReturnValue([
            { isDirectory: () => true, name: 'mod1' }
        ]);

        registerSubscribersFromModules(baseDir, mockPubSub);

        expect((eventBus.subscribe as jest.Mock)).not.toHaveBeenCalled();
    });

    it('should register a subscriber exported as an object', () => {
        // fs.existsSync true for modulesDir and subscribers dir
        (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
            p === modulesDir || p === mod1SubDir
        );

        // readdirSync behavior based on path
        (fs.readdirSync as jest.Mock).mockImplementation((p: string, _opts?: any) => {
            if (p === modulesDir) {
                return [{ isDirectory: () => true, name: 'mod1' }];
            }
            if (p === mod1SubDir) {
                return ['OrderCreatedSubscriber.ts'];
            }
            return [];
        });

        // mock the subscriber module (virtual)
        jest.mock(subscriberFilePath, () => ({
            OrderCreatedSubscriber: {
                eventName: 'OrderCreated',
                handler: jest.fn()
            }
        }), { virtual: true });

        const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });

        registerSubscribersFromModules(baseDir, mockPubSub);

        expect(eventBus.subscribe).toHaveBeenCalledTimes(1);
        const calledWith = (eventBus.subscribe as jest.Mock).mock.calls[0][0];
        expect(calledWith.eventName).toBe('OrderCreated');
        expect(typeof calledWith.handler).toBe('function');

        // Adjusted assertion: console.info is called with a single string message
        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining('[EventBus] registered subscriber')
        );

        consoleInfoSpy.mockRestore();
    });


    it('should register subscribers when module exports multiple subscribers', () => {
        (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
            p === modulesDir || p === mod1SubDir
        );

        (fs.readdirSync as jest.Mock).mockImplementation((p: string, _opts?: any) => {
            if (p === modulesDir) {
                return [{ isDirectory: () => true, name: 'mod1' }];
            }
            if (p === mod1SubDir) {
                return ['MultiSubscriber.ts'];
            }
            return [];
        });

        jest.mock(multiFilePath, () => ({
            OrderCreatedSubscriber: {
                eventName: 'OrderCreated',
                handler: jest.fn()
            },
            InventoryUpdatedSubscriber: {
                eventName: 'InventoryUpdated',
                handler: jest.fn()
            }
        }), { virtual: true });

        registerSubscribersFromModules(baseDir, mockPubSub);

        expect((eventBus.subscribe as jest.Mock).mock.calls.length).toBe(2);
        const names = (eventBus.subscribe as jest.Mock).mock.calls.map(c => c[0].eventName);
        expect(names).toEqual(expect.arrayContaining(['OrderCreated', 'InventoryUpdated']));
    });

    it('should execute a function export (factory) with pubsub and register its returned subscriber', () => {
        (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
            p === modulesDir || p === mod1SubDir
        );

        (fs.readdirSync as jest.Mock).mockImplementation((p: string, _opts?: any) => {
            if (p === modulesDir) {
                return [{ isDirectory: () => true, name: 'mod1' }];
            }
            if (p === mod1SubDir) {
                return ['FuncSubscriber.ts'];
            }
            return [];
        });

        // factory function that verifies it receives pubsub and returns subscriber object
        const factory = jest.fn((_pubsubArg: PubSub) => ({
            eventName: 'FuncEvent',
            handler: jest.fn()
        }));

        jest.mock(funcFilePath, () => ({
            default: factory
        }), { virtual: true });

        registerSubscribersFromModules(baseDir, mockPubSub);

        // factory should have been called with the pubsub we passed
        expect(factory).toHaveBeenCalledWith(mockPubSub);
        expect((eventBus.subscribe as jest.Mock)).toHaveBeenCalledTimes(1);
        expect((eventBus.subscribe as jest.Mock).mock.calls[0][0].eventName).toBe('FuncEvent');
    });

    it('should ignore invalid exports (no eventName or handler)', () => {
        (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
            p === modulesDir || p === mod1SubDir
        );

        (fs.readdirSync as jest.Mock).mockImplementation((p: string, _opts?: any) => {
            if (p === modulesDir) {
                return [{ isDirectory: () => true, name: 'mod1' }];
            }
            if (p === mod1SubDir) {
                return ['BadSubscriber.ts'];
            }
            return [];
        });

        jest.mock(`${mod1SubDir}/BadSubscriber.ts`, () => ({
            NotASubscriber: { foo: 'bar' },
            EmptyFunc: () => ({ notValid: true })
        }), { virtual: true });

        registerSubscribersFromModules(baseDir, mockPubSub);

        expect(eventBus.subscribe as jest.Mock).not.toHaveBeenCalled();
    });
});
