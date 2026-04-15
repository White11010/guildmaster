<script setup lang="ts">
import { watchEffect } from 'vue';

import { type BoardContract, useContractsBoardStore } from '@/entities/ContractsBoard';
import { getContractEstimatedDurationDays } from '@/entities/Contract';
import { BaseLabelValueBlock } from '@/shared/ui/BaseLabelValueBlock';

const contractsBoardStore = useContractsBoardStore();

const props = defineProps<{
  activeContract: BoardContract | null;
}>();
const emit = defineEmits<(e: 'setActiveContract', contract: BoardContract) => void>();

function onContractClick(contract: BoardContract) {
  emit('setActiveContract', contract);
}

watchEffect(() => {
  if (contractsBoardStore.contracts.length === 0) {
    return;
  }
  if (!props.activeContract) {
    emit('setActiveContract', contractsBoardStore.contracts[0]);
  }
  if (!contractsBoardStore.contracts.some((contract) => contract.id === props.activeContract?.id)) {
    emit('setActiveContract', contractsBoardStore.contracts[0]);
  }
});
</script>

<template>
  <div class="watch-contracts-list">
    <div
      v-for="contract in contractsBoardStore.contracts"
      :key="contract.id"
      class="watch-contracts-list__contract"
      :class="{
        'watch-contracts-list__contract--active':
          props.activeContract && contract.id === props.activeContract.id
      }"
      @click="onContractClick(contract)"
    >
      <p class="watch-contracts-list__contract-title">
        {{ contract.title }}
      </p>
      <base-label-value-block :value="contract.customer" label="Заказчик" />
      <div class="watch-contracts-list__contract-short-info">
        <base-label-value-block :value="contract.difficulty" label="Сложность" />
        <base-label-value-block
          :value="contract.daysToStart"
          label="Дней на начало после принятия"
        />
      </div>
      <div class="watch-contracts-list__contract-short-info">
        <base-label-value-block
          :value="getContractEstimatedDurationDays(contract.duration)"
          label="Длительность, дн."
        />
        <base-label-value-block :value="contract.reward.money" label="Награда" />
        <base-label-value-block :value="contract.prepayment" label="Предоплата" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.watch-contracts-list {
  max-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__contract {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 1px solid var(--color-black);
    padding: 0.5rem;

    &--active {
      outline: 4px solid var(--color-black);
    }
  }

  &__contract-title {
    font-weight: bold;
  }

  &__contract-short-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem 1rem;
  }
}
</style>
