<script setup lang="ts">
import { BaseModal, type BaseModalEmits, type BaseModalProps } from "@/shared/ui/BaseModal";
import { type GuildContract, type GuildMercenary, GuildMercenaryAssignmentCard, useGuildStore } from "@/entities/Guild";
import { computed, ref } from "vue";

interface Props  extends BaseModalProps {
  contract: GuildContract | null;
}
const props = defineProps<Props>();
const emit = defineEmits<BaseModalEmits>();

const guildStore = useGuildStore();

const selectedMercenaries = ref<Array<GuildMercenary>>([]);
const assignmentMercenariesPower = computed(() => {
  return selectedMercenaries.value.reduce((totalPower, mercenary) => {
    return totalPower + mercenary.level * 25;
  }, 0);
});

function onSelectMercenaryButtonClick (mercenary: GuildMercenary): void {
  selectedMercenaries.value.push(mercenary);
}
function onCancelMercenaryButtonClick (mercenary: GuildMercenary): void {
  selectedMercenaries.value
      .splice(
          selectedMercenaries.value.findIndex(selectedMercenary => selectedMercenary.id === mercenary.id),
          1
      );
}

function onUpdateModelValue (isOpen: boolean) {
  if (!isOpen) {
    selectedMercenaries.value = [];
  }
  emit('update:modelValue', isOpen);
}

function onStartContractButtonClick () {
  guildStore.startContract(props.contract!, selectedMercenaries.value);
  selectedMercenaries.value = [];
  emit('update:modelValue', false);
}
</script>

<template>
  <base-modal
    title="Контракт"
    :model-value="props.modelValue"
    with-close-button
    width="min(80vw, 1200px)"
    height="min(80vh, 1000px)"
    @update:model-value="onUpdateModelValue"
  >
    <div
      v-if="props.contract"
      class="start-contract"
    >
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
          <p>{{ assignmentMercenariesPower }} / {{ props.contract.power }}</p>
        </div>
        <ul class="start-contract__selected-mercenaries-list">
          <li
            v-for="mercenary in selectedMercenaries"
            :key="mercenary.id"
            class="start-contract__selected-mercenary"
          >
            <p>{{ mercenary.name }}</p>
            <p>{{ mercenary.class }}</p>
            <div class="start-contract__assignment-block">
              <p>Сила:</p>
              <p>{{ mercenary.level * 25 }}</p>
            </div>
          </li>
        </ul>
        <div class="start-contract__available-mernaries-list">
          <guild-mercenary-assignment-card
            v-for="mercenary in guildStore.freeMercenaries"
            :key="mercenary.id"
            :mercenary="mercenary"
            :is-selected="selectedMercenaries.some(selectedMercenary => selectedMercenary.id === mercenary.id)"
            @click:select="onSelectMercenaryButtonClick"
            @click:cancel="onCancelMercenaryButtonClick"
          />
        </div>
        <div class="start-contract__footer">
          <button
            class="start-contract__start-button"
            @click="onStartContractButtonClick"
          >
            Начать
          </button>
        </div>
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
    display: flex;
    flex-direction: column;
    gap: .5rem;
    height: 200px;
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
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__start-button {
    font-size: 2rem;
  }

  &__assignment {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
}
</style>