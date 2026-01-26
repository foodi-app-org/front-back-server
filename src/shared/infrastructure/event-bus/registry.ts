// src/shared/infrastructure/eventBus/registry.ts
import fs from 'node:fs'
import path from 'node:path'
import { eventBus } from './RxjsEventBus'
import type { DomainSubscriber } from '../../domain/EventBus'
import { PubSub } from "graphql-subscriptions"


/**
 * Dynamically loads all subscribers following pattern:
 */
export const registerSubscribersFromModules = (baseDir: string, pubsub: PubSub): void => {
  const modulesDir = path.join(baseDir, 'src', 'modules')
  if (!fs.existsSync(modulesDir)) return

  const modules = fs.readdirSync(modulesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  modules.forEach(m => {
    const subDir = path.join(modulesDir, m, 'infrastructure', 'subscribers')
    if (!fs.existsSync(subDir)) return

    const files = fs.readdirSync(subDir).filter(f => /Subscriber\.(ts|js)$/.test(f))
    files.forEach(file => {
      const full = path.join(subDir, file)
      const mod = require(full)
      Object.values(mod).forEach((exp) => {
        const executedSub = (typeof exp === 'function') ? exp(pubsub) : exp as Partial<DomainSubscriber>
        if (executedSub?.eventName && executedSub?.handler) {
          eventBus.subscribe(executedSub as DomainSubscriber)
          console.info(`[EventBus] registered subscriber ${executedSub.eventName} from ${file}`)
        }
      })
    })
  })
}
