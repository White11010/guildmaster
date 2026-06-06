<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';
import type { Mercenary } from '@/entities/Mercenary';
import { useGuildStore } from '@/entities/Guild';

const props = defineProps<{
  mercenary: Mercenary;
}>();

const guildStore = useGuildStore();

function onHireButtonClick() {
  guildStore.hireMercenary(props.mercenary);
}
</script>

<template>
  <div class="hire-mercenary">
    <base-button
      class="hire-mercenary__button"
      size="lg"
      :disabled="guildStore.money < props.mercenary.price"
      @click="onHireButtonClick"
    >
      Нанять
    </base-button>
  </div>
</template>

<style lang="scss" scoped>
.hire-mercenary {
  display: flex;
  justify-content: center;

  &__button {
    width: 8rem;
  }
}
</style>
