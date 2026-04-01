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
    actions: {
        initMercenaries (mercenaries: Array<Mercenary>) {
            this.mercenaries = mercenaries;
        },
        pushNewMercenary (mercenary: Mercenary) {
            this.mercenaries.push(mercenary);
        },
        pushNewMultipleMercenaries (mercenaries: Array<Mercenary>) {
          this.mercenaries.push(...mercenaries);
        },
        removeMercenaryById (mercenaryId: string) {
            const mercenaryToRemove = this.mercenaries.findIndex((mercenary) => mercenary.id === mercenaryId);
            this.mercenaries.splice(mercenaryToRemove, 1);
        }
    }
});