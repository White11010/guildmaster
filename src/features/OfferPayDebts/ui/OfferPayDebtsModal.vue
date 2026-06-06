<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';
import { BaseCheckbox } from '@/shared/ui/BaseCheckbox';
import { BaseModal, type BaseModalEmits, type BaseModalProps } from '@/shared/ui/BaseModal';
import { useGuildStore } from '@/entities/Guild';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();

const guildStore = useGuildStore();
const { money, mercenariesWithDebt } = storeToRefs(guildStore);

const selectedIds = ref<Set<string>>(new Set());

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      selectedIds.value = guildStore.getGreedyDebtSelection();
    }
  }
);

function setMercenarySelected(id: string, selected: boolean) {
  const next = new Set(selectedIds.value);
  if (selected) {
    next.add(id);
  } else {
    next.delete(id);
  }
  selectedIds.value = next;
}

const selectedTotal = computed(() =>
  mercenariesWithDebt.value
    .filter((mercenary) => selectedIds.value.has(mercenary.id))
    .reduce((sum, mercenary) => sum + mercenary.debt, 0)
);

const canConfirm = computed(
  () => selectedTotal.value > 0 && selectedTotal.value <= guildStore.money
);

function onConfirm() {
  if (!canConfirm.value) {
    return;
  }

  guildStore.paySelectedMercenaryDebts([...selectedIds.value]);
  emit('update:modelValue', false);
}

function onSkip() {
  emit('update:modelValue', false);
}
</script>

<template>
  <base-modal
    title="Погашение долгов"
    :model-value="props.modelValue"
    with-close-button
    width="min(90vw, 520px)"
    max-height="min(85vh, 640px)"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="offer-pay-debts">
      <p class="offer-pay-debts__intro">
        В казне <strong>{{ money }}</strong> золота. Отметьте, чьи долги погасить целиком (можно не
        всех, если не хватает денег).
      </p>
      <ul class="offer-pay-debts__list">
        <li
          v-for="mercenary in mercenariesWithDebt"
          :key="mercenary.id"
          class="offer-pay-debts__row"
        >
          <base-checkbox
            class="offer-pay-debts__label"
            :model-value="selectedIds.has(mercenary.id)"
            @update:model-value="setMercenarySelected(mercenary.id, $event)"
          >
            <span class="offer-pay-debts__name">{{ mercenary.name }}</span>
            <span class="offer-pay-debts__debt">долг: {{ mercenary.debt }}</span>
          </base-checkbox>
        </li>
      </ul>
      <p class="offer-pay-debts__total">
        К списанию: {{ selectedTotal }} / доступно {{ money }}
        <span v-if="selectedTotal > money" class="offer-pay-debts__warn">
          — недостаточно золота</span
        >
      </p>
      <div class="offer-pay-debts__actions">
        <base-button variant="primary" :disabled="!canConfirm" @click="onConfirm">
          Погасить выбранные
        </base-button>
        <base-button @click="onSkip">Пропустить</base-button>
      </div>
    </div>
  </base-modal>
</template>

<style scoped lang="scss">
.offer-pay-debts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.25rem 0 0.5rem;

  &__intro {
    margin: 0;
    line-height: 1.4;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: min(40vh, 320px);
    overflow: auto;
  }

  &__row {
    margin: 0;
  }

  &__label {
    width: 100%;
  }

  &__name {
    flex: 1;
    font-weight: 600;
  }

  &__debt {
    opacity: 0.85;
    font-size: 0.95rem;
  }

  &__total {
    margin: 0;
    font-size: 0.95rem;
  }

  &__warn {
    color: color-mix(in srgb, var(--color-black) 75%, var(--color-white));
    font-weight: 600;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-end;
  }
}
</style>
