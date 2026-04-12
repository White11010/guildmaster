import { defineStore } from "pinia";
import type { Mercenary } from "@/entities/Mercenary";
import { type GuildContract, GuildContractStates, type GuildMercenary } from "@/entities/Guild/model/Guild.types.ts";
import { useHiringMarketStore } from "@/entities/HiringMarket";
import { useContractsBoardStore } from "@/entities/ContractsBoard";
import {
    buildGuildMercenary,
    normalizeGuildMercenary,
} from "@/entities/Guild/model/GuildMercenary.builder.ts";
import {
    MORAL_DECREASE_ALL_MERCS_ON_CONTRACT_OVERDUE,
    MORAL_DECREASE_FOR_CONTRACT_FAILURE,
} from "@/entities/Guild/config/GuildContract.config.ts";
import {
    MORAL_DECREASE_FOR_DEBT_DAY,
    MORAL_DECREASE_FOR_MERCENARY_DEBT_LEAVE,
    MORAL_INCREASE_FOR_CONTRACT_COMPLETION,
} from "@/entities/Guild/config/GuildMercenary.config.ts";
import { getContractSuccessChance } from "@/entities/Guild/lib/getContractSuccessChance.ts";
import { getGuildMercenaryContractPower } from "@/entities/Guild/lib/getGuildMercenaryContractPower.ts";
import { clampGuildMercenaryMoral } from "@/entities/Guild/lib/guildMercenaryMoral.ts";
import { useLogStore } from "@/entities/Log";
import { normalizeGuildContract } from "@/entities/Guild/model/GuildContract.normalize.ts";
import { chance, getRandomInt } from "@/shared/lib/random";

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
        initGuild({
            title,
            fame,
            money,
            reputation,
            mercenaries,
            currentContracts = [],
        }: State) {
            this.title = title;
            this.money = money;
            this.reputation = reputation;
            this.fame = fame;
            this.mercenaries = mercenaries.map(normalizeGuildMercenary);
            this.currentContracts = currentContracts.map(normalizeGuildContract);
        },
        hireMercenary(mercenary: Mercenary) {
            const hiringMarketStore = useHiringMarketStore();
            if (this.money >= mercenary.price) {
                this.mercenaries.push(buildGuildMercenary(mercenary));
                this.money -= mercenary.price;
                hiringMarketStore.removeMercenaryById(mercenary.id);
            }
        },
        updateMercenary(updatedMercenary: Mercenary) {
            const mercenaryToUpdate = this.mercenaries
                .find(mercenary => mercenary.id === updatedMercenary.id);
            if (mercenaryToUpdate) {
                Object.assign(mercenaryToUpdate, updatedMercenary);
            }
        },
        removeMercenary(mercenaryToRemove: Mercenary) {
            this.mercenaries = this.mercenaries
                .filter(mercenary => mercenaryToRemove.id !== mercenary.id);
            this.currentContracts.forEach((contract) => {
                if (contract.state === GuildContractStates.IN_PROGRESS) {
                    contract.mercenaries = contract.mercenaries.filter(
                        (m) => m.id !== mercenaryToRemove.id,
                    );
                }
            });
        },
        processMercenariesWhoLeaveAtZeroMorale(gameDay: number) {
            const logStore = useLogStore();
            while (true) {
                const leaver = this.mercenaries.find((m) => m.moral <= 0);
                if (!leaver) {
                    break;
                }
                const leaverName = leaver.name;
                this.removeMercenary(leaver);
                this.mercenaries.forEach((m) => {
                    const beforeMoral = m.moral;
                    m.moral = clampGuildMercenaryMoral(
                        m.moral - MORAL_DECREASE_FOR_MERCENARY_DEBT_LEAVE,
                    );
                    logStore.addMercenaryMoraleChange({
                        mercenaryName: m.name,
                        beforeMoral,
                        afterMoral: m.moral,
                        reason: "уход коллеги из-за нулевой морали",
                        day: gameDay,
                    });
                });
                logStore.addMercenaryLeftGuild(leaverName, gameDay);
            }
        },
        addContract(contract: GuildContract) {
            const contractsBoardStore = useContractsBoardStore();

            this.currentContracts.push(contract);

            contractsBoardStore.removeContractById(contract.id);

            this.addMoney(contract.prepayment);
        },
        startContract(contract: GuildContract, mercenaries: Array<GuildMercenary>) {
            const contractToStart = this.currentContracts
                .find(currentContract => currentContract.id === contract.id);
            if (contractToStart) {
                contractToStart.mercenaries = mercenaries;
                contractToStart.state = GuildContractStates.IN_PROGRESS;
                contractToStart.daysInProgress = 0;
                contractToStart.actualDurationDays = getRandomInt(
                    contractToStart.duration[0],
                    contractToStart.duration[1],
                );
            }
        },
        updateContract(updatedContract: GuildContract) {
            const contractToUpdate = this.currentContracts
                .find(contract => contract.id === updatedContract.id);
            if (contractToUpdate) {
                Object.assign(contractToUpdate, updatedContract);
            }
        },
        addMoney(amount: number) {
            this.money += amount;
        },
        removeMoney(amount: number) {
            this.money -= amount;
        },
        addReputation(reputation: number) {
            this.reputation += reputation;
        },
        removeReputation(reputation: number) {
            this.reputation -= reputation;
        },
        addFame(fame: number) {
            this.fame += fame;
        },
        removeFame(fame: number) {
            this.fame -= fame;
        },
        paySalary() {
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
        applyDebtMoralePerDay(gameDay: number) {
            const logStore = useLogStore();
            this.mercenaries.forEach((mercenary: GuildMercenary) => {
                if (mercenary.debt > 0) {
                    mercenary.debtDays += 1;
                    const beforeMoral = mercenary.moral;
                    mercenary.moral = clampGuildMercenaryMoral(
                        mercenary.moral - MORAL_DECREASE_FOR_DEBT_DAY,
                    );
                    logStore.addMercenaryMoraleChange({
                        mercenaryName: mercenary.name,
                        beforeMoral,
                        afterMoral: mercenary.moral,
                        reason: "долг по зарплате",
                        day: gameDay,
                    });
                }
            });
        },
        payMercenaryDebt(mercenaryId: string) {
            const mercenary = this.mercenaries.find((m) => m.id === mercenaryId);
            if (!mercenary || mercenary.debt <= 0 || this.money < mercenary.debt) {
                return;
            }
            this.money -= mercenary.debt;
            mercenary.debt = 0;
            mercenary.debtDays = 0;
        },
        increaseContractsDays(gameDay: number) {
            const logStore = useLogStore();
            this.currentContracts.forEach((contract: GuildContract) => {
                contract.daysAfterTaken += 1;

                if (contract.state === GuildContractStates.IN_PROGRESS) {
                    contract.daysInProgress += 1;
                    const durationNeeded =
                        contract.actualDurationDays ?? contract.duration[0];
                    if (contract.daysInProgress >= durationNeeded) {
                        const squadPower = contract.mercenaries.reduce(
                            (sum, m) => {
                                const guildMercenary = this.mercenaries.find(
                                    (gm) => gm.id === m.id,
                                );
                                return (
                                    sum +
                                    (guildMercenary
                                        ? getGuildMercenaryContractPower(guildMercenary)
                                        : 0)
                                );
                            },
                            0,
                        );
                        const successChance = getContractSuccessChance(
                            squadPower,
                            contract.power,
                        );
                        if (chance(successChance)) {
                            contract.state = GuildContractStates.COMPLETED;
                            this.addMoney(contract.reward.money);
                            contract.mercenaries.forEach((m) => {
                                const guildMercenary = this.mercenaries.find(
                                    (gm) => gm.id === m.id,
                                );
                                if (guildMercenary) {
                                    const beforeMoral = guildMercenary.moral;
                                    guildMercenary.moral = clampGuildMercenaryMoral(
                                        guildMercenary.moral +
                                            MORAL_INCREASE_FOR_CONTRACT_COMPLETION,
                                    );
                                    logStore.addMercenaryMoraleChange({
                                        mercenaryName: guildMercenary.name,
                                        beforeMoral,
                                        afterMoral: guildMercenary.moral,
                                        reason: `успешное выполнение контракта «${contract.title}»`,
                                        day: gameDay,
                                        intendedMoraleIncrease:
                                            MORAL_INCREASE_FOR_CONTRACT_COMPLETION,
                                    });
                                }
                            });
                            logStore.addContractCompleted(contract.title, gameDay);
                        } else {
                            contract.state = GuildContractStates.FAILED;
                            contract.mercenaries.forEach((m) => {
                                const guildMercenary = this.mercenaries.find(
                                    (gm) => gm.id === m.id,
                                );
                                if (guildMercenary) {
                                    const beforeMoral = guildMercenary.moral;
                                    guildMercenary.moral = clampGuildMercenaryMoral(
                                        guildMercenary.moral -
                                            MORAL_DECREASE_FOR_CONTRACT_FAILURE,
                                    );
                                    logStore.addMercenaryMoraleChange({
                                        mercenaryName: guildMercenary.name,
                                        beforeMoral,
                                        afterMoral: guildMercenary.moral,
                                        reason: `провал контракта «${contract.title}»`,
                                        day: gameDay,
                                    });
                                }
                            });
                            logStore.addContractFailed(contract.title, gameDay);
                        }
                    }
                }

                if (contract.state === GuildContractStates.PENDING) {
                    if (contract.daysAfterTaken >= contract.daysToStart) {
                        contract.state = GuildContractStates.OVERDUE;
                        this.mercenaries.forEach((m) => {
                            const beforeMoral = m.moral;
                            m.moral = clampGuildMercenaryMoral(
                                m.moral - MORAL_DECREASE_ALL_MERCS_ON_CONTRACT_OVERDUE,
                            );
                            logStore.addMercenaryMoraleChange({
                                mercenaryName: m.name,
                                beforeMoral,
                                afterMoral: m.moral,
                                reason: `просрочка контракта «${contract.title}»`,
                                day: gameDay,
                            });
                        });
                        logStore.addContractOverdue(contract.title, gameDay);
                    }
                }
            });

        }
    }
});