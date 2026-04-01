import { defineStore } from "pinia";

interface State {
    title: string
    money: number
    fame: number
    reputation: number
}

export const useGuildStore = defineStore('guild', {
    state: (): State => {
        return {
            title: '',
            money: 0,
            fame: 0,
            reputation: 0
        };
    },
    actions: {
        initGuild ({ title, fame, money, reputation }: State)  {
            this.title = title;
            this.money = money;
            this.reputation = reputation;
            this.fame = fame;
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