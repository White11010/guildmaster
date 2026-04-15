<script setup lang="ts">
import type { BoardContract } from '@/entities/ContractsBoard';
import { BaseLabelValueBlock } from '@/shared/ui/BaseLabelValueBlock';

const props = defineProps<{
  contract: BoardContract;
}>();
</script>

<template>
  <div class="watch-contract-info">
    <h3 class="watch-contract-info__title">
      {{ props.contract.title }}
    </h3>
    <p class="watch-contract-info__description">
      {{ props.contract.description }}
    </p>
    <base-label-value-block
      :value="props.contract.daysToStart"
      label="Дней на начало выполнения после принятия"
    />
  </div>
</template>

<style scoped lang="scss">
.watch-contract-info {
  &__description {
    margin-bottom: 1rem;
  }
}
</style>
