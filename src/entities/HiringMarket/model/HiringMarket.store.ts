import { defineStore } from "pinia";
import type { Mercenary } from "@/entities/Mercenary";

interface State {
    mercenaries: Array<Mercenary>;
}

export const useHiringMarketStore = defineStore('hiringMarket', {
    state: (): State => {
        return {
            mercenaries: []
        };
    },
    getters: {
      mercenariesIds: (state: State) => state.mercenaries.map(mercenary => mercenary.id)
    },
    actions: {
        initMercenaries (mercenaries: Array<Mercenary>) {
            this.mercenaries = mercenaries;
        },
        addNewMercenary (mercenary: Mercenary) {
            this.mercenaries.unshift(mercenary);
        },
        addNewMultipleMercenaries (mercenaries: Array<Mercenary>) {
          this.mercenaries.unshift(...mercenaries);
        },
        removeMercenaryById (mercenaryId: string) {
            const mercenaryToRemove = this.mercenaries.findIndex((mercenary) => mercenary.id === mercenaryId);
            this.mercenaries.splice(mercenaryToRemove, 1);
        }
    }
});