import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { BoardContract } from '@/entities/ContractsBoard';

export const useContractsBoardStore = defineStore('contractsBoard', () => {
  const contracts = ref<BoardContract[]>([]);

  const contractsIds = computed(() => contracts.value.map((contract) => contract.id));

  function initContracts(newContracts: BoardContract[]) {
    contracts.value = newContracts;
  }

  function addNewContract(contract: BoardContract) {
    contracts.value.unshift(contract);
  }

  function addNewMultipleContracts(newContracts: BoardContract[]) {
    contracts.value.unshift(...newContracts);
  }

  function removeContractById(contractId: string) {
    const contractToRemove = contracts.value.findIndex((contract) => contract.id === contractId);
    contracts.value.splice(contractToRemove, 1);
  }

  return {
    contracts,
    contractsIds,
    initContracts,
    addNewContract,
    addNewMultipleContracts,
    removeContractById
  };
});
