<script setup lang="ts">
import type { BoardContract } from '@/entities/ContractsBoard';
import { buildGuildContract, useGuildStore } from '@/entities/Guild';

const props = defineProps<{
  contract: BoardContract;
}>();

const guildStore = useGuildStore();

function onAcceptButtonClick(): void {
  guildStore.addContract(buildGuildContract(props.contract));
}
</script>

<template>
  <div class="accept-contract">
    <button class="accept-contract__button" @click="onAcceptButtonClick">Принять</button>
  </div>
</template>

<style scoped lang="scss">
.accept-contract {
  display: flex;
  justify-content: center;

  &__button {
    font-size: 1.5rem;
  }
}
</style>
