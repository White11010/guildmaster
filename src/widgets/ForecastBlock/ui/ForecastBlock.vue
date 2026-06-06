<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/entities/Game';
import { useGuildStore } from '@/entities/Guild';
import { BaseContentBlock } from '@/shared/ui/BaseContentBlock';

const FORECAST_DAYS = 7;

const gameStore = useGameStore();
const guildStore = useGuildStore();

function formatSignedValue(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }

  return value.toString();
}

const forecastCards = computed(() =>
  guildStore.getCashflowForecast(gameStore.currentGame.day, FORECAST_DAYS)
);
</script>

<template>
  <base-content-block title="Прогноз">
    <div class="forecast-block">
      <p class="forecast-block__caption">
        7 дней вперёд. Доход учитывает ожидаемую выплату по активным контрактам.
      </p>

      <div class="forecast-block__list">
        <article
          v-for="card in forecastCards"
          :key="card.dayNumber"
          class="forecast-block__card"
          :class="{
            'forecast-block__card--positive': card.delta > 0,
            'forecast-block__card--negative': card.delta < 0
          }"
        >
          <header class="forecast-block__card-header">
            <div>
              <p class="forecast-block__card-label">{{ card.dayLabel }}</p>
              <p class="forecast-block__card-day">День {{ card.dayNumber }}</p>
            </div>
            <p class="forecast-block__card-delta">
              {{ formatSignedValue(card.delta) }}
            </p>
          </header>

          <div class="forecast-block__gold">
            <p class="forecast-block__gold-label">Золото к концу дня</p>
            <p class="forecast-block__gold-value">{{ card.endGold }}</p>
          </div>

          <div class="forecast-block__metrics">
            <div class="forecast-block__metric">
              <p class="forecast-block__metric-label">Доход</p>
              <p class="forecast-block__metric-value forecast-block__metric-value--positive">
                {{ formatSignedValue(card.income) }}
              </p>
            </div>
            <div class="forecast-block__metric">
              <p class="forecast-block__metric-label">Траты</p>
              <p class="forecast-block__metric-value forecast-block__metric-value--negative">
                {{ formatSignedValue(-card.expenses) }}
              </p>
            </div>
          </div>

          <footer class="forecast-block__events">
            <p v-if="card.contractEvents > 0">{{ card.contractEvents }} контр. в расчёте</p>
            <p v-if="card.salaryEvents > 0">{{ card.salaryEvents }} выплат зарплаты</p>
            <p v-if="card.contractEvents === 0 && card.salaryEvents === 0">Спокойный день</p>
          </footer>
        </article>
      </div>
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">
.forecast-block {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__caption {
    font-size: 0.85rem;
    line-height: 1.2;
    color: color-mix(in srgb, var(--color-black) 70%, var(--color-white));
  }

  &__list {
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
    padding-right: 0.25rem;
  }

  &__card {
    border: 1px solid color-mix(in srgb, var(--color-black) 18%, var(--color-white));
    padding: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: color-mix(in srgb, var(--color-white) 94%, var(--color-black));

    &--positive {
      border-left: 4px solid var(--color-black);
    }

    &--negative {
      border-left: 4px solid color-mix(in srgb, var(--color-black) 70%, var(--color-white));
    }
  }

  &__card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__card-label {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__card-day {
    font-size: 0.95rem;
    color: color-mix(in srgb, var(--color-black) 70%, var(--color-white));
  }

  &__card-delta {
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1;
  }

  &__gold {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  &__gold-label {
    font-size: 0.875rem;
    color: color-mix(in srgb, var(--color-black) 70%, var(--color-white));
  }

  &__gold-value {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }

  &__metric {
    padding-top: 0.5rem;
    border-top: 1px solid color-mix(in srgb, var(--color-black) 12%, var(--color-white));
  }

  &__metric-label {
    font-size: 0.875rem;
    color: color-mix(in srgb, var(--color-black) 70%, var(--color-white));
  }

  &__metric-value {
    margin-top: 0.15rem;
    font-size: 1rem;
    font-weight: 600;

    &--positive,
    &--negative {
      color: var(--color-black);
    }
  }

  &__events {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: color-mix(in srgb, var(--color-black) 68%, var(--color-white));
  }
}
</style>
