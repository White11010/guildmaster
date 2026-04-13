<script setup lang="ts">
import { getContractEstimatedDurationDays } from '@/entities/Contract';
import {
  type GuildContract,
  GuildContractStates,
  GuildContractStatesTitles
} from '@/entities/Guild';
import { computed } from 'vue';

const props = defineProps<{
  contract: GuildContract;
}>();
const emit = defineEmits<(e: 'click:start') => void>();

const boardEstimateDays = computed(() => getContractEstimatedDurationDays(props.contract.duration));

const durationNeeded = computed(
  () => props.contract.actualDurationDays ?? props.contract.duration[0]
);

const daysUntilEnd = computed(() => {
  if (props.contract.state !== GuildContractStates.IN_PROGRESS) {
    return null;
  }
  return Math.max(0, durationNeeded.value - props.contract.daysInProgress);
});

/** Дольше оценки с доски (среднее min–max duration), пока контракт ещё в работе. */
const daysBeyondBoardEstimate = computed(() => {
  if (props.contract.state !== GuildContractStates.IN_PROGRESS) {
    return null;
  }
  const diff = props.contract.daysInProgress - boardEstimateDays.value;
  if (diff <= 0) {
    return null;
  }
  return Math.max(1, Math.ceil(diff));
});

const missionMercenaryNames = computed(() => props.contract.mercenaries.map((m) => m.name));
</script>

<template>
  <div class="contract-guild-card">
    <div class="contract-guild-card__head">
      <p class="contract-guild-card__title">
        {{ props.contract.title }}
      </p>
      <p class="contract-guild-card__state">
        {{ GuildContractStatesTitles[props.contract.state] }}
      </p>
    </div>
    <div class="contract-guild-card__meta">
      <p v-if="props.contract.state === GuildContractStates.PENDING">
        Дней, чтобы начать: {{ props.contract.daysToStart - props.contract.daysAfterTaken }}
      </p>
      <template v-if="props.contract.state === GuildContractStates.IN_PROGRESS">
        <p v-if="daysUntilEnd !== null">Дней до завершения (по плану): {{ daysUntilEnd }}</p>
        <p v-if="daysBeyondBoardEstimate !== null" class="contract-guild-card__warn">
          Уже дольше оценочного срока с доски (~{{ boardEstimateDays }} дн.) на
          {{ daysBeyondBoardEstimate }} дн.
        </p>
        <div v-if="missionMercenaryNames.length" class="contract-guild-card__squad">
          <p class="contract-guild-card__squad-label">На задании:</p>
          <ul class="contract-guild-card__squad-list">
            <li v-for="(name, index) in missionMercenaryNames" :key="`${name}-${index}`">
              {{ name }}
            </li>
          </ul>
        </div>
      </template>
    </div>
    <button
      v-if="props.contract.state === GuildContractStates.PENDING"
      class="contract-guild-card__start-button"
      type="button"
      @click="emit('click:start')"
    >
      Начать
    </button>
  </div>
</template>

<style scoped lang="scss">
.contract-guild-card {
  border: 1px solid var(--color-black);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: stretch;

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__title {
    font-weight: bold;
    margin: 0;
  }

  &__state {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.85;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.95rem;

    p {
      margin: 0;
    }
  }

  &__warn {
    color: color-mix(in srgb, var(--color-black) 70%, var(--color-white));
    font-weight: 600;
  }

  &__squad {
    margin-top: 0.25rem;
  }

  &__squad-label {
    margin: 0 0 0.2rem;
    font-weight: 600;
  }

  &__squad-list {
    margin: 0;
    padding-left: 1.25rem;
  }

  &__start-button {
    align-self: flex-start;
    margin-top: 0.25rem;
    font-size: 1rem;
  }
}
</style>
