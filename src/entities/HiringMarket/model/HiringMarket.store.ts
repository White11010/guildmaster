import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Mercenary } from '@/entities/Mercenary';

export const useHiringMarketStore = defineStore('hiringMarket', () => {
  const mercenaries = ref<Mercenary[]>([]);

  const mercenariesIds = computed(() => mercenaries.value.map((mercenary) => mercenary.id));

  function initMercenaries(newMercenaries: Mercenary[]) {
    mercenaries.value = newMercenaries;
  }

  function addNewMultipleMercenaries(newMercenaries: Mercenary[]) {
    mercenaries.value.unshift(...newMercenaries);
  }

  function removeMercenaryById(mercenaryId: string) {
    const mercenaryToRemove = mercenaries.value.findIndex(
      (mercenary) => mercenary.id === mercenaryId
    );
    mercenaries.value.splice(mercenaryToRemove, 1);
  }

  return {
    mercenaries,
    mercenariesIds,
    initMercenaries,
    addNewMultipleMercenaries,
    removeMercenaryById
  };
});
