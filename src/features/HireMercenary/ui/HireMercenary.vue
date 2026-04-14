<script setup lang="ts">
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
    <button
      class="hire-mercenary__button"
      :disabled="guildStore.money < props.mercenary.price"
      @click="onHireButtonClick"
    >
      Нанять
    </button>
  </div>
</template>

<style lang="scss" scoped>
.hire-mercenary {
  display: flex;
  justify-content: center;

  &__button {
    width: 8rem;
    font-size: 1.5rem;
  }
}
</style>
