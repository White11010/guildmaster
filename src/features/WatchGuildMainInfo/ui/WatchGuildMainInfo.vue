<script setup lang="ts">
import { useGuildStore } from '@/entities/Guild';
import { BaseLabelValueBlock } from '@/shared/ui/BaseLabelValueBlock';
import { storeToRefs } from 'pinia';

const guildStore = useGuildStore();
const { completedContractsCount, failedContractsCount } = storeToRefs(guildStore);
</script>

<template>
  <div class="watch-guild-main-info">
    <p class="watch-guild-main-info__title">
      {{ guildStore.title }}
    </p>
    <div class="watch-guild-main-info__gold-block">
      <p class="watch-guild-main-info__gold-block-label">Золото:</p>
      <p class="watch-guild-main-info__gold-block-value">
        {{ guildStore.money }}
      </p>
    </div>
    <div class="watch-guild-main-info__info">
      <base-label-value-block :value="guildStore.fame" label="Известность" />
      <base-label-value-block :value="guildStore.reputation" label="Репутация" />
      <base-label-value-block :value="completedContractsCount" label="Контрактов выполнено" />
      <base-label-value-block :value="failedContractsCount" label="Контрактов провалено" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.watch-guild-main-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__title {
    font-size: 1.5rem;
  }

  &__gold-block {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  &__gold-block-label {
    font-size: 1.5rem;
    text-decoration: underline;
  }
  &__gold-block-value {
    font-size: 1.5rem;
    font-weight: bold;
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 2rem;
    gap: 1rem;
  }
}
</style>
