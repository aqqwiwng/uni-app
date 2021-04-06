import { extend } from '@vue/shared'
// @ts-ignore TODO 等待 vue3 的兼容模式自带emitter
import E from './TinyEmitter'

export function initBridge(
  namespace: 'service' | 'view'
): UniApp.UniServiceJSBridge {
  // TODO vue3 compatibility builds
  const emitter = new E()
  return extend(emitter, {
    subscribe(event: string, callback: Function): void {
      return emitter.on(`${namespace}.${event}`, callback)
    },
    unsubscribe(event: string, callback: Function): void {
      return emitter.off(`${namespace}.${event}`, callback)
    },
    subscribeHandler(event: string, args: unknown, pageId: number): void {
      if (__DEV__) {
        console.log(
          `[${namespace}][subscribeHandler][${Date.now()}]:${event}, ${JSON.stringify(
            args
          )}, ${pageId}`
        )
      }
      return emitter.emit(`${namespace}.${event}`, args, pageId)
    },
  })
}