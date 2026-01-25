import { NextResponse } from 'next/server';

global.Request = class {
    constructor(input, init) {
        this.input = input;
        this.init = init;
    }
};

test('GET request should return a response', async () => {
    const response = await NextResponse.json({ message: 'Success' });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
});