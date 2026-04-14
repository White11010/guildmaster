<script setup lang="ts">
import { useHiringMarketStore } from '@/entities/HiringMarket';
import type { Mercenary } from '@/entities/Mercenary';
import { ClassesTitles, SpeciesTitles } from '@/entities/Mercenary';
import { watchEffect } from 'vue';

const hiringMarketStore = useHiringMarketStore();

const props = defineProps<{
  activeMercenary: Mercenary | null;
}>();
const emit = defineEmits<(e: 'setActiveMercenary', mercenary: Mercenary) => void>();

function onMercenaryClick(mercenary: Mercenary) {
  emit('setActiveMercenary', mercenary);
}

watchEffect(() => {
  if (hiringMarketStore.mercenaries.length === 0) {
    return;
  }
  if (!props.activeMercenary) {
    emit('setActiveMercenary', hiringMarketStore.mercenaries[0]);
  }
  if (
    !hiringMarketStore.mercenaries.some((mercenary) => mercenary.id === props.activeMercenary?.id)
  ) {
    emit('setActiveMercenary', hiringMarketStore.mercenaries[0]);
  }
});
</script>

<template>
  <div class="watch-market-mercenaries-list">
    <div
      v-for="mercenary in hiringMarketStore.mercenaries"
      :key="mercenary.id"
      class="watch-market-mercenaries-list__mercenary"
      :class="{
        'watch-market-mercenaries-list__mercenary--active':
          props.activeMercenary && mercenary.id === props.activeMercenary.id
      }"
      @click="onMercenaryClick(mercenary)"
    >
      <header class="watch-market-mercenaries-list__mercenary-header">
        <p class="watch-market-mercenaries-list__mercenary-name">
          {{ mercenary.name }}
        </p>
      </header>
      <div class="watch-market-mercenaries-list__mercenary-main-info">
        <div class="watch-market-mercenaries-list__mercenary-short-info-block">
          <p class="watch-market-mercenaries-list__mercenary-short-info-block-value">
            {{ ClassesTitles[mercenary.class] }}
          </p>
        </div>
        <div class="watch-market-mercenaries-list__mercenary-short-info-block">
          <p class="watch-market-mercenaries-list__mercenary-short-info-block-value">
            {{ SpeciesTitles[mercenary.species] }}
          </p>
        </div>
        <base-label-value-block :value="mercenary.level" label="Уровень" />
      </div>
      <div class="watch-market-mercenaries-list__mercenary-short-info">
        <base-label-value-block :value="mercenary.price" label="Стоимость" />
        <base-label-value-block :value="mercenary.salary" label="Плата в неделю" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.watch-market-mercenaries-list {
  max-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__mercenary-info {
    max-height: 100%;
    overflow: auto;
    border-left: 2px solid var(--color-black);
    height: 100%;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  &__mercenary-full-info {
    flex: 1;
  }
  &__mercenary-actions {
    display: flex;
    justify-content: center;
  }
  &__mercenary-hire-button {
    font-size: 1.5rem;
  }

  &__mercenary {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 1px solid var(--color-black);
    padding: 0.5rem;
    cursor: pointer;
    &--active {
      outline: 4px solid var(--color-black);
    }
  }
}
</style>
