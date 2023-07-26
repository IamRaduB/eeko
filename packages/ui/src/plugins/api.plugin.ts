import type { Plugin } from 'vue';
import { Api } from '../api/api';
import type { PiniaPlugin } from 'pinia';
import { TranslationApi } from '../api/translation.api';

const api = new Api(
  import.meta.env.VITE_CORE_DEVMODE ? 'http://localhost:3333' : undefined
);
const translationApi = new TranslationApi(api);

export const apiPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$api = api;
    app.config.globalProperties.$translationApi = translationApi;
  },
};

export const apiPiniaPlugin: PiniaPlugin = ({ store }) => {
  store.$api = api;
  store.$translationApi = translationApi;
};

// declare module 'vue/types/vue' {
//   interface Vue {
//     $api: Api
//     $authApi: AuthApi
//   }
// }

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $api: Api;
    $translationApi: TranslationApi;
  }
}
