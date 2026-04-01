<script setup lang="ts">
import { ref } from "vue";
import { useHiringMarketStore } from "@/entities/HiringMarket";
import type { Mercenary } from "@/entities/Mercenary";
import { SpeciesTitles, ClassesTitles } from '@/entities/Mercenary';
import { BaseContentBlock } from "@/shared/ui/BaseContentBlock";

const hiringMarketStore = useHiringMarketStore();

const activeMercenary = ref<Mercenary>(hiringMarketStore.mercenaries[0]);
function onMercenaryClick (mercenary: Mercenary): void {
  activeMercenary.value = mercenary;
}
</script>

<template>
  <base-content-block :title="'Рынок наемников'">
    <div class="hiring-market__mercenaries">
      <div class="hiring-market__mercenaries-list">
        <div
          v-for="mercenary in hiringMarketStore.mercenaries"
          :key="mercenary.id"
          class="hiring-market__mercenary"
          :class="{
            'hiring-market__mercenary--active': mercenary.id === activeMercenary.id
          }"
          @click="onMercenaryClick(mercenary)"
        >
          <header class="hiring-market__mercenary-header">
            <p class="hiring-market__mercenary-name">
              {{ mercenary.name }}
            </p>
          </header>
          <div class="hiring-market__mercenary-main-info">
            <div class="hiring-market__mercenary-short-info-block">
              <p class="hiring-market__mercenary-short-info-block-value">
                {{ ClassesTitles[mercenary.class] }}
              </p>
            </div>
            <div class="hiring-market__mercenary-short-info-block">
              <p class="hiring-market__mercenary-short-info-block-value">
                {{ SpeciesTitles[mercenary.species] }}
              </p>
            </div>
            <div class="hiring-market__mercenary-short-info-block">
              <p class="hiring-market__mercenary-short-info-block-title">
                Уровень:
              </p>
              <p class="hiring-market__mercenary-short-info-block-value">
                {{ mercenary.level }}
              </p>
            </div>
          </div>
          <div class="hiring-market__mercenary-short-info">
            <div class="hiring-market__mercenary-short-info-block">
              <p class="hiring-market__mercenary-short-info-block-title">
                Стоимость:
              </p>
              <p class="hiring-market__mercenary-short-info-block-value">
                {{ mercenary.price }}
              </p>
            </div>
            <div class="hiring-market__mercenary-short-info-block">
              <p class="hiring-market__mercenary-short-info-block-title">
                Плата в неделю:
              </p>
              <p class="hiring-market__mercenary-short-info-block-value">
                {{ mercenary.salary }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="hiring-market__mercenary-info">
        <div class="hiring-market__mercenary-full-info">
          <h3>{{ activeMercenary.name }}</h3>
          <p>{{ activeMercenary.background }}</p>
        </div>
        <div class="hiring-market__mercenary-actions">
          <button class="hiring-market__mercenary-hire-button">
            Нанять
          </button>
        </div>
      </div>
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">
.hiring-market {
  &__mercenaries {
    height: 100%;
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
  }

  &__mercenaries-list {
    max-height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__mercenary-info {
    border-left: 2px solid black;
    height: 100%;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
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
    gap: .5rem;
    border: 1px solid black;
    padding: .5rem;
    cursor: pointer;
    &--active {
      outline: 4px solid black;
    }
  }

  &__mercenary-main-info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }
  &__mercenary-name {
    font-weight: bold;
  }
  &__mercenary-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  &__mercenary-short-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 1rem;
  }
  &__mercenary-short-info-block {
    display: flex;
    align-items: center;
    gap: 1rem;
    &:last-child {
      justify-content: flex-end;
    }
  }
}
</style>