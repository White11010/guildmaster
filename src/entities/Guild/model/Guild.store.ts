import { defineStore } from "pinia";
import type { Mercenary } from "@/entities/Mercenary";
import type { GuildContract } from "@/entities/Guild/model/Guild.types.ts";
import { useHiringMarketStore } from "@/entities/HiringMarket";

interface State {
    title: string
    money: number
    fame: number
    reputation: number
    mercenaries: Array<Mercenary>
    currentContracts: Array<GuildContract>
}

export const useGuildStore = defineStore('guild', {
    state: (): State => {
        return {
            title: '',
            money: 0,
            fame: 0,
            reputation: 0,
            mercenaries: [],
            currentContracts: []
        };
    },
    actions: {
        initGuild ({ title, fame, money, reputation, mercenaries }: State)  {
            this.title = title;
            this.money = money;
            this.reputation = reputation;
            this.fame = fame;
            this.mercenaries = mercenaries;
        },
        hireMercenary (mercenary: Mercenary) {
            const hiringMarketStore = useHiringMarketStore();
            if (this.money >= mercenary.price) {
                this.mercenaries.push(mercenary);
                this.money -= mercenary.price;
                hiringMarketStore.removeMercenaryById(mercenary.id);
            }
        },
        updateMercenary (updatedMercenary: Mercenary) {
          const mercenaryToUpdate = this.mercenaries
              .find(mercenary => mercenary.id === updatedMercenary.id);
          if (mercenaryToUpdate) {
              Object.assign(mercenaryToUpdate, updatedMercenary);
          }
        },
        removeMercenary (mercenaryToRemove: Mercenary) {
            this.mercenaries = this.mercenaries
                .filter(mercenary => mercenaryToRemove.id !== mercenary.id);
        },
        addContract (contract: GuildContract) {
            this.currentContracts.push(contract);
        },
        updateContract (updatedContract: GuildContract) {
            const contractToUpdate = this.currentContracts
                .find(contract => contract.id === updatedContract.id);
            if (contractToUpdate) {
                Object.assign(contractToUpdate, updatedContract);
            }
        },
        addMoney (amount: number) {
            this.money += amount;
        },
        removeMoney (amount: number) {
            this.money -= amount;
        },
        addReputation (reputation: number) {
            this.reputation += reputation;
        },
        removeReputation (reputation: number) {
            this.reputation -= reputation;
        },
        addFame (fame: number) {
            this.fame += fame;
        },
        removeFame (fame: number) {
            this.fame -= fame;
        }
    }
});