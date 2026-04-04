import { defineStore } from "pinia";
import type { Mercenary } from "@/entities/Mercenary";
import { type GuildContract, GuildContractStates, type GuildMercenary } from "@/entities/Guild/model/Guild.types.ts";
import { useHiringMarketStore } from "@/entities/HiringMarket";
import { useContractsBoardStore } from "@/entities/ContractsBoard";

interface State {
    title: string
    money: number
    fame: number
    reputation: number
    mercenaries: Array<GuildMercenary>
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
    getters: {
        guildMercenariesIds: (state) => state.mercenaries.map(mercenary => mercenary.id),
        guildContractsIds: (state) => state.currentContracts.map(contract => contract.id),
        freeMercenaries: state => {
            const contractsInProgress = state.currentContracts
                .filter(contract => contract.state === GuildContractStates.IN_PROGRESS);
            const busyMercenariesIds = contractsInProgress
                .reduce<Array<string>>((mercenaries, contract) => {
                    return [...mercenaries, ...contract.mercenaries.map(mercenary => mercenary.id)];
                }, []);
            return state.mercenaries.filter(mercenary => !busyMercenariesIds.includes(mercenary.id));
        }
    },
    actions: {
        initGuild ({ title, fame, money, reputation, mercenaries }: State) {
            this.title = title;
            this.money = money;
            this.reputation = reputation;
            this.fame = fame;
            this.mercenaries = mercenaries;
        },
        hireMercenary (mercenary: Mercenary) {
            const hiringMarketStore = useHiringMarketStore();
            if (this.money >= mercenary.price) {
                this.mercenaries.push({
                    ...mercenary,
                    daysInGuild: 0,
                    debt: 0
                });
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
            const contractsBoardStore = useContractsBoardStore();

            this.currentContracts.push(contract);

            contractsBoardStore.removeContractById(contract.id);

            this.addMoney(contract.prepayment);
        },
        startContract (contract: GuildContract, mercenaries: Array<GuildMercenary>) {
            const contractToStart = this.currentContracts
                .find(currentContract => currentContract.id === contract.id);
            if (contractToStart) {
                contractToStart.mercenaries = mercenaries;
                contractToStart.state = GuildContractStates.IN_PROGRESS;
            }
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
        },
        paySalary () {
            this.mercenaries.forEach((mercenary: GuildMercenary) => {
                mercenary.daysInGuild += 1;

                if (mercenary.daysInGuild % 7 === 0) {
                    if (this.money >= mercenary.salary) {
                        this.money -= mercenary.salary;
                    } else {
                        mercenary.debt = mercenary.salary - this.money;
                        this.money = 0;
                    }
                }
            });
        },
        increaseContractsDays () {
            this.currentContracts.forEach((contract: GuildContract) => {
                contract.daysAfterTaken += 1;

                if (contract.state === GuildContractStates.IN_PROGRESS) {
                    contract.daysInProgress += 1;
                    if (contract.daysInProgress >= contract.duration[0]) {
                        contract.state = GuildContractStates.COMPLETED;
                        this.addMoney(contract.reward.money);
                    }
                }

                if (contract.state === GuildContractStates.PENDING) {
                    if (contract.daysAfterTaken >= contract.daysToStart) {
                        contract.state = GuildContractStates.OVERDUE;
                    }
                }
            });

        }
    }
});