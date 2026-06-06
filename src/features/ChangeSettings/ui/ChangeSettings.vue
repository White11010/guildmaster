<script setup lang="ts">
import { BaseCheckbox } from '@/shared/ui/BaseCheckbox';
import { BaseModal, type BaseModalEmits, type BaseModalProps } from '@/shared/ui/BaseModal';
import { ref } from 'vue';
import { type SettingsItem, SettingsItemTypes } from '../model/ChangeSettings.types.ts';

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();

const settings: SettingsItem[] = [
  {
    title: 'Тут будут настройки',
    type: SettingsItemTypes.CHECKBOX,
    handler() {
      console.log('settings');
    }
  },
  {
    title: 'Тут будут настройки',
    type: SettingsItemTypes.CHECKBOX,
    handler() {
      console.log('settings');
    }
  },
  {
    title: 'Тут будут настройки',
    type: SettingsItemTypes.CHECKBOX,
    handler() {
      console.log('settings');
    }
  }
];

const checkboxStates = ref(settings.map(() => false));

function onCheckboxUpdate(index: number, value: boolean) {
  checkboxStates.value[index] = value;
  settings[index].handler();
}
</script>

<template>
  <base-modal
    :model-value="props.modelValue"
    :title="'Настройки'"
    with-close-button
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="settings-modal">
      <div v-for="(setting, index) in settings" :key="setting.title" class="settings-modal__item">
        <p class="settings-modal__item-title">
          {{ setting.title }}
        </p>
        <base-checkbox
          :model-value="checkboxStates[index]"
          @update:model-value="onCheckboxUpdate(index, $event)"
        />
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
}
</style>
