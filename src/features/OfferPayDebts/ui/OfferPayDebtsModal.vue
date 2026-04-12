<script setup lang="ts">
import { BaseModal, type BaseModalEmits, type BaseModalProps } from "@/shared/ui/BaseModal";
import { useGuildStore, type GuildMercenary } from "@/entities/Guild";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

interface Props extends BaseModalProps {}
const props = defineProps<Props>();
const emit = defineEmits<BaseModalEmits>();

const guildStore = useGuildStore();
const { money } = storeToRefs(guildStore);

const mercenariesWithDebt = computed(() =>
    guildStore.mercenaries.filter((m) => m.debt > 0),
);

/** Жадно: сначала меньшие долги, пока хватает золота — максимум полных погашений. */
function buildGreedySelection(
    list: Array<GuildMercenary>,
    available: number,
): Set<string> {
    const sorted = [...list].sort((a, b) => a.debt - b.debt);
    const ids = new Set<string>();
    let sum = 0;
    for (const m of sorted) {
        if (sum + m.debt <= available) {
            ids.add(m.id);
            sum += m.debt;
        }
    }
    return ids;
}

const selectedIds = ref<Set<string>>(new Set());

watch(
    () => props.modelValue,
    (open) => {
        if (open) {
            selectedIds.value = buildGreedySelection(
                mercenariesWithDebt.value,
                guildStore.money,
            );
        }
    },
);

function toggleId(id: string) {
    const next = new Set(selectedIds.value);
    if (next.has(id)) {
        next.delete(id);
    } else {
        next.add(id);
    }
    selectedIds.value = next;
}

const selectedTotal = computed(() =>
    mercenariesWithDebt.value
        .filter((m) => selectedIds.value.has(m.id))
        .reduce((s, m) => s + m.debt, 0),
);

const canConfirm = computed(
    () =>
        selectedTotal.value > 0 &&
        selectedTotal.value <= guildStore.money,
);

function onConfirm() {
    if (!canConfirm.value) {
        return;
    }
    const ordered = mercenariesWithDebt.value
        .filter((m) => selectedIds.value.has(m.id))
        .sort((a, b) => a.debt - b.debt);
    for (const m of ordered) {
        guildStore.payMercenaryDebt(m.id);
    }
    emit("update:modelValue", false);
}

function onSkip() {
    emit("update:modelValue", false);
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
        В казне <strong>{{ money }}</strong> золота. Отметьте, чьи долги погасить целиком
        (можно не всех, если не хватает денег).
      </p>
      <ul class="offer-pay-debts__list">
        <li
          v-for="m in mercenariesWithDebt"
          :key="m.id"
          class="offer-pay-debts__row"
        >
          <label class="offer-pay-debts__label">
            <input
              type="checkbox"
              :checked="selectedIds.has(m.id)"
              @change="toggleId(m.id)"
            >
            <span class="offer-pay-debts__name">{{ m.name }}</span>
            <span class="offer-pay-debts__debt">долг: {{ m.debt }}</span>
          </label>
        </li>
      </ul>
      <p class="offer-pay-debts__total">
        К списанию: {{ selectedTotal }} / доступно {{ money }}
        <span
          v-if="selectedTotal > money"
          class="offer-pay-debts__warn"
        > — недостаточно золота</span>
      </p>
      <div class="offer-pay-debts__actions">
        <button
          type="button"
          class="offer-pay-debts__btn offer-pay-debts__btn--primary"
          :disabled="!canConfirm"
          @click="onConfirm"
        >
          Погасить выбранные
        </button>
        <button
          type="button"
          class="offer-pay-debts__btn"
          @click="onSkip"
        >
          Пропустить
        </button>
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
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 0.35rem 0.25rem;
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    input {
      flex-shrink: 0;
    }
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
    color: #a52a2a;
    font-weight: 600;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  &__btn {
    padding: 0.5rem 1rem;
    font: inherit;
    cursor: pointer;
    border: 1px solid #333;
    background: #fff;

    &--primary {
      background: #1a472a;
      color: #fff;
      border-color: #1a472a;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
