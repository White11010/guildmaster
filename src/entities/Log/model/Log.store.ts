import { defineStore } from "pinia";
import { type LogEvent, LogEventTypes } from "@/entities/Log";
import type { Mercenary } from "@/entities/Mercenary";
import { v4 as uuidv4 } from 'uuid';
import type { BoardContract } from "@/entities/ContractsBoard";
import { GUILD_MERCENARY_MORAL_MAX } from "@/entities/Guild/config/GuildMercenary.config.ts";

interface State {
    log: Array<LogEvent>;
}

export const useLogStore = defineStore('log', {
    state: (): State => {
        return {
            log: []
        };
    },
    actions: {
        initLog (log: Array<LogEvent>) {
          this.log = log;
        },
        addNewMercenaryEvent (mercenary: Mercenary, day?: number) {
            this.log.unshift({
                id: uuidv4(),
                type: LogEventTypes.NEW_MERCENARY,
                text: `На рынке доступен новый наемник: ${mercenary.name}`,
                day,
            });
        },
        addNewMercenaryEventMultiple (mercenaries: Array<Mercenary>, day?: number) {
            mercenaries.forEach((mercenary: Mercenary) => {
                this.addNewMercenaryEvent(mercenary, day);
            });
        },
        addNewContractEven (contract: BoardContract, day?: number) {
            this.log.unshift({
                id: uuidv4(),
                type: LogEventTypes.NEW_CONTRACT,
                text: `На доске доступен новый контракт: ${contract.title}`,
                day,
            });
        },
        addNewContractEvenMultiple (contracts: Array<BoardContract>, day?: number) {
            contracts.forEach((contract: BoardContract) => {
                this.addNewContractEven(contract, day);
            });
        },
        addMercenaryMoraleChange (params: {
            mercenaryName: string;
            reason: string;
            day: number;
            beforeMoral: number;
            afterMoral: number;
            intendedMoraleIncrease?: number;
        }) {
            const {
                mercenaryName,
                reason,
                day,
                beforeMoral,
                afterMoral,
                intendedMoraleIncrease,
            } = params;
            const actual = afterMoral - beforeMoral;
            let text: string;
            if (
                intendedMoraleIncrease !== undefined &&
                intendedMoraleIncrease > 0
            ) {
                if (actual === 0) {
                    text =
                        `${mercenaryName}: мораль не изменилась (уже максимум ${GUILD_MERCENARY_MORAL_MAX}), `;
                } else if (actual < intendedMoraleIncrease) {
                    text =
                        `${mercenaryName}: мораль +${actual} вместо +${intendedMoraleIncrease} ` +
                        `(было ${beforeMoral} до потолка ${GUILD_MERCENARY_MORAL_MAX}) — ${reason}`;
                } else {
                    text = `${mercenaryName}: мораль +${actual} — ${reason}`;
                }
            } else {
                const sign = actual > 0 ? "+" : "";
                text = `${mercenaryName}: мораль ${sign}${actual} — ${reason}`;
            }
            this.log.unshift({
                id: uuidv4(),
                type: LogEventTypes.MERCENARY_MORALE,
                text,
                day,
            });
        },
        addMercenaryLeftGuild (mercenaryName: string, day: number) {
            this.log.unshift({
                id: uuidv4(),
                type: LogEventTypes.MERCENARY_LEFT_GUILD,
                text: `${mercenaryName} покинул гильдию (мораль на нуле)`,
                day,
            });
        },
        addContractCompleted (contractTitle: string, day: number) {
            this.log.unshift({
                id: uuidv4(),
                type: LogEventTypes.CONTRACT_COMPLETED,
                text: `Контракт выполнен: «${contractTitle}»`,
                day,
            });
        },
        addContractFailed (contractTitle: string, day: number) {
            this.log.unshift({
                id: uuidv4(),
                type: LogEventTypes.CONTRACT_FAILED,
                text: `Контракт провален: «${contractTitle}»`,
                day,
            });
        },
        addContractOverdue (contractTitle: string, day: number) {
            this.log.unshift({
                id: uuidv4(),
                type: LogEventTypes.CONTRACT_OVERDUE,
                text: `Просрочен контракт: «${contractTitle}»`,
                day,
            });
        },
    }
});