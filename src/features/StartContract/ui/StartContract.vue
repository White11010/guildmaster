<script setup lang="ts">
import { BaseModal, type BaseModalEmits, type BaseModalProps } from "@/shared/ui/BaseModal";
import { CONTRACT_MIN_SQUAD_POWER_RATIO_TO_START } from "@/entities/Guild/config/GuildContract.config.ts";
import { type GuildContract, type GuildMercenary, GuildMercenaryAssignmentCard, useGuildStore } from "@/entities/Guild";
import { getContractSuccessChance } from "@/entities/Guild/lib/getContractSuccessChance.ts";
import { getGuildMercenaryContractPower } from "@/entities/Guild/lib/getGuildMercenaryContractPower.ts";
import { computed, ref } from "vue";

interface Props extends BaseModalProps {
  contract: GuildContract | null;
}
const props = defineProps<Props>();
const emit = defineEmits<BaseModalEmits>();

const guildStore = useGuildStore();

const selectedMercenaries = ref<Array<GuildMercenary>>([]);
const assignmentMercenariesPower = computed(() => {
  return selectedMercenaries.value.reduce((totalPower, mercenary) => {
    return totalPower + getGuildMercenaryContractPower(mercenary);
  }, 0);
});

const minSquadPowerForContract = computed(() =>
  props.contract
    ? Math.ceil(props.contract.power * CONTRACT_MIN_SQUAD_POWER_RATIO_TO_START)
    : 0
);

const canStartContract = computed(() =>
  props.contract !== null &&
  assignmentMercenariesPower.value >= minSquadPowerForContract.value
);

const contractSuccessChancePercent = computed(() => {
  if (!props.contract || !canStartContract.value) {
    return null;
  }
  const p = getContractSuccessChance(
    assignmentMercenariesPower.value,
    props.contract.power,
  );
  return Math.round(p * 1000) / 10;
});

function onSelectMercenaryButtonClick(mercenary: GuildMercenary): void {
  selectedMercenaries.value.push(mercenary);
}
function onCancelMercenaryButtonClick(mercenary: GuildMercenary): void {
  selectedMercenaries.value
    .splice(
      selectedMercenaries.value.findIndex(selectedMercenary => selectedMercenary.id === mercenary.id),
      1
    );
}

function onUpdateModelValue(isOpen: boolean) {
  if (!isOpen) {
    selectedMercenaries.value = [];
  }
  emit('update:modelValue', isOpen);
}

function onStartContractButtonClick() {
  if (!canStartContract.value || !props.contract) {
    return;
  }
  guildStore.startContract(props.contract, selectedMercenaries.value);
  selectedMercenaries.value = [];
  emit('update:modelValue', false);
}
</script>

<template>
  <base-modal title="Контракт" :model-value="props.modelValue" with-close-button width="min(80vw, 1200px)"
    height="min(80vh, 1000px)" @update:model-value="onUpdateModelValue">
    <div v-if="props.contract" class="start-contract">
      <div class="start-contract__container">
        <h3>{{ props.contract.title }}</h3>
        <p>
          {{ props.contract.description }}
        </p>
        <div class="start-contract__full-info">
          <div class="start-contract__info-block">
            <p>Заказчик:</p>
            <p>{{ props.contract.customer }}</p>
          </div>
          <div class="start-contract__info-block">
            <p>Сложность:</p>
            <p>{{ props.contract.difficulty }}</p>
          </div>
          <div class="start-contract__info-block">
            <p>Награда:</p>
            <p>{{ props.contract.reward.money }}</p>
          </div>
        </div>
        <div class="start-contract__assignment">
          <div class="start-contract__assignment-block">
            <p>Сила отряда:</p>
            <p>{{ assignmentMercenariesPower.toFixed(1) }} / {{ props.contract.power }}</p>
          </div>
          <p v-if="contractSuccessChancePercent !== null" class="start-contract__success-chance">
            Шанс успешного прохождения: {{ contractSuccessChancePercent }}%
          </p>
          <p v-if="!canStartContract" class="start-contract__power-hint">
            Минимум для старта: {{ minSquadPowerForContract }}
            ({{ Math.round(CONTRACT_MIN_SQUAD_POWER_RATIO_TO_START * 100) }}% силы контракта)
          </p>
          <ul class="start-contract__selected-mercenaries-list">
            <li v-for="mercenary in selectedMercenaries" :key="mercenary.id" class="start-contract__selected-mercenary">
              <p>{{ mercenary.name }}</p>
              <p>{{ mercenary.class }}</p>
              <div class="start-contract__assignment-block">
                <p>Сила (с моралью):</p>
                <p>{{ getGuildMercenaryContractPower(mercenary).toFixed(1) }}</p>
              </div>
            </li>
          </ul>
          <div class="start-contract__available-mernaries-list">
            <guild-mercenary-assignment-card v-for="mercenary in guildStore.freeMercenaries" :key="mercenary.id"
              :mercenary="mercenary"
              :is-selected="selectedMercenaries.some(selectedMercenary => selectedMercenary.id === mercenary.id)"
              @click:select="onSelectMercenaryButtonClick" @click:cancel="onCancelMercenaryButtonClick" />
          </div>
        </div>

      </div>
      <div class="start-contract__footer">
        <button class="start-contract__start-button" type="button" :disabled="!canStartContract"
          @click="onStartContractButtonClick">
          Начать
        </button>
      </div>
    </div>
  </base-modal>
</template>

<style scoped lang="scss">
.start-contract {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &__container {
    height: calc(100% - 3.75rem);
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__full-info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }

  &__info-block {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  &__selected-mercenaries-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  &__selected-mercenary {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }

  &__available-mernaries-list {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 200px;
    gap: 1rem;
  }

  &__footer {
    height: 3.75rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__power-hint {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.65;
  }

  &__success-chance {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  &__start-button {
    font-size: 2rem;

    &:disabled {
      cursor: not-allowed;
    }
  }

  &__assignment {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  &__assignment-block {
    display: flex;
    gap: .5rem;
  }
}
</style>