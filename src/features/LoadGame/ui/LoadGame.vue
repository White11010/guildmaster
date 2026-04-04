<script setup lang="ts">
import { BaseModal, type BaseModalEmits, type BaseModalProps } from "@/shared/ui/BaseModal";

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();
</script>

<template>
  <base-modal
    title="Загрузить игру"
    :model-value="props.modelValue"
    with-close-button
    @update:model-value="emit('update:modelValue', $event)"
  >
    Список игр для загрузки
  </base-modal>
</template>

<style scoped lang="scss">

</style>