<script setup lang="ts">
import { BaseContentBlock } from '@/shared/ui/BaseContentBlock';
import { type GuildContract, GuildContractCard, useGuildStore } from '@/entities/Guild';
import { defineAsyncComponent, ref } from 'vue';

const StartContract = defineAsyncComponent(() =>
  import('@/features/StartContract').then((m) => m.StartContract)
);

const guildStore = useGuildStore();

const isStartContractModalOpen = ref(false);
const contractToStart = ref<GuildContract | null>(null);

function onStartContractButtonClick(contract: GuildContract): void {
  contractToStart.value = contract;
  isStartContractModalOpen.value = true;
}
</script>

<template>
  <base-content-block title="Активные контракты">
    <div
      v-if="guildStore.currentContracts && guildStore.currentContracts.length"
      class="guild-contracts-block"
    >
      <guild-contract-card
        v-for="contract in guildStore.currentContracts"
        :key="contract.id"
        :contract="contract"
        @click:start="onStartContractButtonClick(contract)"
      />
    </div>
    <div v-else class="guild-mercenaries-block__empty">
      <p>Пока у вас нет контрактов</p>
    </div>
  </base-content-block>

  <start-contract v-model="isStartContractModalOpen" :contract="contractToStart" />
</template>

<style scoped lang="scss">
.guild-contracts-block {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
