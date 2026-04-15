<script setup lang="ts">
import { ref } from 'vue';

import { AcceptContract } from '@/features/AcceptContract';
import { WatchContractInfo } from '@/features/WatchContractInfo';
import { WatchContractsList } from '@/features/WatchContractsList';
import { type BoardContract, useContractsBoardStore } from '@/entities/ContractsBoard';
import { BaseContentBlock } from '@/shared/ui/BaseContentBlock';

const contractsBoardStore = useContractsBoardStore();

const activeContract = ref<BoardContract | null>(contractsBoardStore.contracts[0] ?? null);
function onSetActiveContract(contract: BoardContract) {
  activeContract.value = contract;
}
</script>

<template>
  <base-content-block title="Доска контрактов">
    <div v-if="contractsBoardStore.contracts.length && activeContract" class="contracts-block">
      <watch-contracts-list
        :active-contract="activeContract"
        @set-active-contract="onSetActiveContract"
      />
      <div class="contracts-block__contract-info">
        <watch-contract-info
          :contract="activeContract"
          class="contracts-block__contract-full-info"
        />
        <accept-contract :contract="activeContract" />
      </div>
    </div>
    <div v-else class="contracts-block__empty">
      <p>Сейчас нет доступных контрактов</p>
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">
.contracts-block {
  height: 100%;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;

  &__contract-info {
    border-left: 2px solid var(--color-black);
    height: 100%;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: 100%;
    gap: 1rem;
  }

  &__contract-full-info {
    flex: 1;
  }

  &__empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
}
</style>
