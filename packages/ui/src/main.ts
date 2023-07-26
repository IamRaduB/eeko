import './assets/styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { routerPiniaPluginFactory } from './plugins/pinia-router.plugin';
import { apiPiniaPlugin, apiPlugin } from './plugins/api.plugin';
import RouterFactory from './router';

const app = createApp(App);

app.use(apiPlugin);

// use apiPlugin in pinia store
const pinia = createPinia();
const router = RouterFactory(pinia);
pinia.use(apiPiniaPlugin);
pinia.use(routerPiniaPluginFactory(router));
app.use(pinia);
app.use(router);

app.mount('#app');
