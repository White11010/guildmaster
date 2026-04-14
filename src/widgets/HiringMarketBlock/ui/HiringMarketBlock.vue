<script setup lang="ts">
import { ref } from 'vue';

import { WatchMarketMercenariesList } from '@/features/WatchMarketMercenariesList';
import { WatchMarketMercenaryInfo } from '@/features/WatchMarketMercenaryInfo';
import { HireMercenary } from '@/features/HireMercenary';
import { useHiringMarketStore } from '@/entities/HiringMarket';
import type { Mercenary } from '@/entities/Mercenary';
import { BaseContentBlock } from '@/shared/ui/BaseContentBlock';

const hiringMarketStore = useHiringMarketStore();

const activeMercenary = ref<Mercenary | null>(hiringMarketStore.mercenaries[0] ?? null);
function onSetActiveMercenary(mercenary: Mercenary) {
  activeMercenary.value = mercenary;
}
</script>

<template>
  <base-content-block :title="'Рынок наемников'">
    <div v-if="hiringMarketStore.mercenaries.length && activeMercenary" class="hiring-market">
      <watch-market-mercenaries-list
        :active-mercenary="activeMercenary"
        @set-active-mercenary="onSetActiveMercenary"
      />
      <div class="hiring-market__mercenary-info">
        <watch-market-mercenary-info
          :mercenary="activeMercenary"
          class="hiring-market__mercenary-full-info"
        />
        <hire-mercenary :mercenary="activeMercenary" />
      </div>
    </div>
    <div v-else class="hiring-market__empty">
      <p>Сейчас нет доступных наемников</p>
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">
.hiring-market {
  height: 100%;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;

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
  &__empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
}
</style>
