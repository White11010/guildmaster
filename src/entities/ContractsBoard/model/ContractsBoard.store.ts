import { defineStore } from 'pinia';
import type { BoardContract } from '@/entities/ContractsBoard';

interface State {
  contracts: BoardContract[];
}

export const useContractsBoardStore = defineStore('contractsBoard', {
  state: (): State => {
    return {
      contracts: []
    };
  },
  getters: {
    contractsIds: (state) => state.contracts.map((contract) => contract.id)
  },
  actions: {
    initContracts(contracts: BoardContract[]) {
      this.contracts = contracts;
    },
    addNewContract(contract: BoardContract) {
      this.contracts.unshift(contract);
    },
    addNewMultipleContracts(contracts: BoardContract[]) {
      this.contracts.unshift(...contracts);
    },
    removeContractById(contractId: string) {
      const contractToRemove = this.contracts.findIndex((contract) => contract.id === contractId);
      this.contracts.splice(contractToRemove, 1);
    }
  }
});
