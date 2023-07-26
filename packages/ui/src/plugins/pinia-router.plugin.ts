import type { Router } from 'vue-router'
import type { PiniaPlugin } from 'pinia'
import { markRaw } from 'vue'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router
  }
}

export function routerPiniaPluginFactory(router: Router): PiniaPlugin {
  return ({ store }) => {
    store.router = markRaw(router)
  }
}
