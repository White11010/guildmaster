import type { App } from 'vue';
import { BaseLabelValueBlock } from '@/shared/ui/BaseLabelValueBlock';

export const globalComponents = {
  install(app: App) {
    app.component('BaseLabelValueBlock', BaseLabelValueBlock);
  }
};
