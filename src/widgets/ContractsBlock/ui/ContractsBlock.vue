<script setup lang="ts">
import { BaseContentBlock } from '@/shared/ui/BaseContentBlock';
import { ref } from 'vue';
import { type BoardContract, useContractsBoardStore } from '@/entities/ContractsBoard';
import { getContractEstimatedDurationDays } from '@/entities/Contract';
import { buildGuildContract, useGuildStore } from '@/entities/Guild';
import { BaseLabelValueBlock } from '@/shared/ui/BaseLabelValueBlock';

const contractsBoardStore = useContractsBoardStore();
const guildStore = useGuildStore();

const activeContract = ref<BoardContract | null>(contractsBoardStore.contracts[0] ?? null);
function onContractClick(contract: BoardContract) {
  activeContract.value = contract;
}

function onAcceptButtonClick(): void {
  if (activeContract.value) {
    guildStore.addContract(buildGuildContract(activeContract.value));
    activeContract.value = contractsBoardStore.contracts[0] ?? null;
  }
}
</script>

<template>
  <base-content-block title="Доска контрактов">
    <div v-if="contractsBoardStore.contracts.length" class="contracts-block">
      <div class="contracts-block__list">
        <div
          v-for="contract in contractsBoardStore.contracts"
          :key="contract.id"
          class="contracts-block__contract"
          :class="{
            'contracts-block__contract--active': activeContract && contract.id === activeContract.id
          }"
          @click="onContractClick(contract)"
        >
          <p class="contracts-block__contract-title">
            {{ contract.title }}
          </p>
          <base-label-value-block :value="contract.customer" label="Заказчик" />
          <div class="contracts-block__contract-short-info">
            <base-label-value-block :value="contract.difficulty" label="Сложность" />
            <base-label-value-block
              :value="contract.daysToStart"
              label="Дней на начало после принятия"
            />
          </div>
          <div class="contracts-block__contract-short-info">
            <base-label-value-block
              :value="getContractEstimatedDurationDays(contract.duration)"
              label="Длительность, дн."
            />
            <base-label-value-block :value="contract.reward.money" label="Награда" />
            <base-label-value-block :value="contract.prepayment" label="Предоплата" />
          </div>
        </div>
      </div>
      <div class="contracts-block__contract-info">
        <template v-if="activeContract">
          <div class="contracts-block__contract-full-info">
            <h3 class="contracts-block__contract-info-title">
              {{ activeContract.title }}
            </h3>
            <p class="contracts-block__contract-description">
              {{ activeContract.description }}
            </p>
            <base-label-value-block
              :value="activeContract.daysToStart"
              label="Дней на начало выполнения после принятия"
            />
          </div>
          <div class="contracts-block__contract-actions">
            <button
              class="contracts-block__contract-accept-button"
              :disabled="!activeContract"
              @click="onAcceptButtonClick"
            >
              Принять
            </button>
          </div>
        </template>
        <div v-else>Выберите контракт в списке</div>
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

  &__list {
    max-height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

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
  &__contract-short-info-block {
    display: flex;
    gap: 0.5rem;
  }

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
  &__contract-actions {
    display: flex;
    justify-content: center;
  }
  &__contract-accept-button {
    font-size: 1.5rem;
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
