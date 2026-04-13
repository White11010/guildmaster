import { createApp } from 'vue';
import { pinia, router } from './providers';
import App from './App.vue';
export const app = createApp(App).use(pinia).use(router);
