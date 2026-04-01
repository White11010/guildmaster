<script setup lang="ts">
import { BaseModal, type BaseModalEmits, type BaseModalProps } from "@/shared/ui/BaseModal";
import { type SettingsItem, SettingsItemTypes } from "./SettionsModal.types.ts";

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();

const settings: Array<SettingsItem> = [
  {
    title: 'Автосохранения',
    type: SettingsItemTypes.CHECKBOX,
    handler () {

    }
  },
  {
    title: 'Автосохранения',
    type: SettingsItemTypes.CHECKBOX,
    handler () {

    }
  },
  {
    title: 'Автосохранения',
    type: SettingsItemTypes.CHECKBOX,
    handler () {

    }
  }
];
</script>

<template>
  <base-modal
    :model-value="props.modelValue"
    :title="'Настройки'"
    with-close-button
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="settings-modal">
      <div
        v-for="setting in settings"
        :key="setting.title"
        class="settings-modal__item"
      >
        <p class="settings-modal__item-title">
          {{ setting.title }}
        </p>
        <input
          class="settings-modal__checkbox"
          type="checkbox"
        >
      </div>
    </div>
  </base-modal>
</template>

<style lang="scss" scoped>
.settings-modal {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
  }

  &__item-title {
    font-size: 1.5rem;
  }

  &__checkbox {
    width: 2rem;
    height: 2rem;
  }
}
</style>