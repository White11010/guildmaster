import { defineStore } from "pinia";
import { type LogEvent, LogEventTypes } from "@/entities/Log";
import type { Mercenary } from "@/entities/Mercenary";
import { v4 as uuidv4 } from 'uuid';
import type { BoardContract } from "@/entities/ContractsBoard";

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
        addNewMercenaryEvent (mercenary: Mercenary) {
            this.log.unshift({
                id: uuidv4(),
                type: LogEventTypes.NEW_MERCENARY,
                text: `На рынке доступен новый наемник: ${mercenary.name}`
            });
        },
        addNewMercenaryEventMultiple (mercenaries: Array<Mercenary>) {
            mercenaries.forEach((mercenary: Mercenary) => {
                this.addNewMercenaryEvent(mercenary);
            });
        },
        addNewContractEven (contract: BoardContract) {
            this.log.unshift({
                id: uuidv4(),
                type: LogEventTypes.NEW_CONTRACT,
                text: `На доске доступен новый контракт: ${contract.title}`
            });
        },
        addNewContractEvenMultiple (contracts: Array<BoardContract>) {
            contracts.forEach((contract: BoardContract) => {
                this.addNewContractEven(contract);
            });
        }
    }
});