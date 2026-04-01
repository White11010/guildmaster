<script setup lang="ts">
import { BaseContentBlock } from "@/shared/ui/BaseContentBlock";
import { ref } from "vue";
import { type BoardContract, useContractsBoardStore } from "@/entities/ContractsBoard";

const contractsBoardStore = useContractsBoardStore();

const activeContract = ref(contractsBoardStore.contracts[0]);
function onContractClick (contract: BoardContract) {
  activeContract.value = contract;
}
</script>

<template>
  <base-content-block title="Доска контрактов">
    <div class="contracts-block">
      <div class="contracts-block__list">
        <div
          v-for="contract in contractsBoardStore.contracts"
          :key="contract.id"
          class="contracts-block__contract"
          :class="{
            'contracts-block__contract--active': contract.id === activeContract.id,
          }"
          @click="onContractClick(contract)"
        >
          <p class="contracts-block__contract-title">
            {{ contract.title }}
          </p>
          <div class="contracts-block__contract-short-info-block">
            <p>Заказчик:</p>
            <p>{{ contract.customer }}</p>
          </div>
          <div class="contracts-block__contract-short-info">
            <div class="contracts-block__contract-short-info-block">
              <p>Сложность:</p>
              <p>{{ contract.difficulty }}</p>
            </div>
          </div>
          <div class="contracts-block__contract-short-info">
            <div class="contracts-block__contract-short-info-block">
              <p>Награда:</p>
              <p>{{ contract.reward.money }}</p>
            </div>
            <div class="contracts-block__contract-short-info-block">
              <p>Предоплата:</p>
              <p>{{ contract.prepayment }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="contracts-block__contract-info">
        <div class="contracts-block__contract-full-info">
          <h3 class="contracts-block__contract-info-title">
            {{ activeContract.title }}
          </h3>
          <p class="contracts-block__contract-description">
            {{ activeContract.description }}
          </p>
        </div>
        <div class="contracts-block__contract-actions">
          <button class="contracts-block__contract-accept-button">
            Принять
          </button>
        </div>
      </div>
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
    gap: 2rem;
  }

  &__contract {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    border: 1px solid black;
    padding: .5rem;
    &--active {
      outline: 4px solid black;
    }
  }

  &__contract-title {
    font-weight: bold;
  }
  &__contract-short-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  &__contract-short-info-block {
    display: flex;
    gap: .5rem;
  }

  &__contract-info {
    border-left: 2px solid black;
    height: 100%;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
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

}
</style>