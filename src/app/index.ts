import { createApp } from 'vue';
import { pinia, router } from './providers';
import App from './App.vue';
import { globalComponents } from './providers/globalComponents';
export const app = createApp(App).use(pinia).use(router).use(globalComponents);
