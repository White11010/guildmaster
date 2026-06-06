<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';
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
    <base-button class="accept-contract__button" size="lg" @click="onAcceptButtonClick">
      Принять
    </base-button>
  </div>
</template>

<style scoped lang="scss">
.accept-contract {
  display: flex;
  justify-content: center;
}
</style>
