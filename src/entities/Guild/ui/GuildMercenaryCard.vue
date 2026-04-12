<script setup lang="ts">
import type { GuildMercenary } from "@/entities/Guild";
import { GuildContractStates, useGuildStore } from "@/entities/Guild";
import { ClassesTitles, SpeciesTitles } from "@/entities/Mercenary";
import { BaseLabelValueBlock } from "@/shared/ui/BaseLabelValueBlock";
import { computed } from "vue";

const props = defineProps<{
  mercenary: GuildMercenary;
}>();

const guildStore = useGuildStore();

const isOnMission = computed(() =>
    guildStore.currentContracts.some(
        (c) =>
            c.state === GuildContractStates.IN_PROGRESS &&
            c.mercenaries.some((m) => m.id === props.mercenary.id),
    ),
);

/** Дней до следующей выплаты зарплаты (каждые 7 дней в гильдии). */
const daysUntilSalary = computed(() => {
    const d = props.mercenary.daysInGuild % 7;
    return d === 0 ? 7 : 7 - d;
});

function onPayDebtClick() {
  guildStore.payMercenaryDebt(props.mercenary.id);
}
</script>

<template>
  <div
    class="mercenary-guild-card"
    :class="{ 'mercenary-guild-card--on-mission': isOnMission }"
  >
    <div class="mercenary-guild-card__inner">
      <p class="mercenary-guild-card__name">
        {{ props.mercenary.name }}
      </p>
      <div class="mercenary-guild-card__main-info">
      <p>
        {{ ClassesTitles[props.mercenary.class] }}
      </p>
      <p>
        {{ SpeciesTitles[props.mercenary.species] }}
      </p>
      <p>{{ props.mercenary.level }} уровень</p>
    </div>
    <div class="mercenary-guild-card__salary-info">
      <base-label-value-block
        :value="isOnMission ? 'На задании' : 'Свободен'"
        label="Статус"
      />
      <base-label-value-block
        :value="props.mercenary.salary"
        :label="'Зарплата в неделю'"
      />
      <base-label-value-block
        :value="daysUntilSalary"
        :label="'Дней до выплаты зарплаты'"
      />
    </div>
    <div class="mercenary-guild-card__extra-info">
      <base-label-value-block
        :value="props.mercenary.daysInGuild"
        :label="'Дней в гильдии'"
      />
      <base-label-value-block
        :value="props.mercenary.debt"
        :label="'Долг'"
      />
      <base-label-value-block
        :value="props.mercenary.debtDays"
        :label="'Дней с долгом'"
      />
      <base-label-value-block
        :value="props.mercenary.moral"
        :label="'Мораль'"
      />
    </div>
      <button
        v-if="props.mercenary.debt > 0"
        type="button"
        class="mercenary-guild-card__pay-debt"
        :disabled="guildStore.money < props.mercenary.debt"
        @click="onPayDebtClick"
      >
        Погасить долг ({{ props.mercenary.debt }})
      </button>
    </div>
    <div
      v-if="isOnMission"
      class="mercenary-guild-card__mission-overlay"
      aria-hidden="true"
    >
      На задании
    </div>
  </div>
</template>

<style scoped lang="scss">
.mercenary-guild-card {
  position: relative;
  border: 1px solid black;
  padding: .5rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &__inner {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  &--on-mission &__inner {
    filter: blur(3px);
    pointer-events: none;
    user-select: none;
  }

  &__mission-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #1a1a1a;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(1px);
    pointer-events: none;
  }

  &__name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  &__main-info {
    display: grid;
    gap: .5rem;
    grid-template-columns: 1fr 1fr 1fr;
  }

  &__salary-info {
    display: grid;
    gap: .5rem;
    grid-template-columns: 1fr 1fr;
  }

  &__extra-info {
    display: grid;
    gap: .5rem;
    grid-template-columns: 1fr 1fr;
  }

  &__pay-debt {
    padding: .35rem .5rem;
    cursor: pointer;
    border: 1px solid #333;
    background: #f5f5f5;
    font: inherit;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }
}
</style>