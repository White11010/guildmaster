import { defineStore } from "pinia";
import { AppNavigationItems } from "./AppNavigation.types.ts";

interface State {
    currentTab: AppNavigationItems;
}

export const useAppNavigationStore = defineStore('appNavigation', {
    state: (): State => {
        return {
            currentTab: AppNavigationItems.GUILD
        };
    },
    actions: {
        setCurrentTab (tab: AppNavigationItems) {
            this.currentTab = tab;
        },
    }
});