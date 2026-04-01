import { defineStore } from "pinia";
import type { BoardContract } from "@/entities/ContractsBoard";

interface State {
    contracts: Array<BoardContract>;
}

export const useContractsBoardStore = defineStore('contractsBoard', {
    state: (): State => {
        return {
            contracts: []
        };
    },
    actions: {
        initContracts (contracts: Array<BoardContract>) {
          this.contracts = contracts;
        },
        pushNewContract (contract: BoardContract) {
            this.contracts.push(contract);
        },
        pushNewMultipleContracts (contracts: Array<BoardContract>) {
            this.contracts.push(...contracts);
        },
        removeContractById (contractId: string) {
            const contractToRemove = this.contracts.findIndex((contract) => contract.id === contractId);
            this.contracts.splice(contractToRemove, 1);
        }
    }
});