<script setup lang="ts">
import { type GuildContract, GuildContractStates, GuildContractStatesTitles } from "@/entities/Guild";

const props = defineProps<{
  contract: GuildContract;
}>();
const emit = defineEmits<{
  (e: 'click:start'): void;
}>();
</script>

<template>
  <div class="contract-guild-card">
    <p>{{ props.contract.title }}</p>
    <p>{{ GuildContractStatesTitles[props.contract.state] }}</p>
    <div class="contract-guild-card__days-left">
      <p v-if="props.contract.state === GuildContractStates.PENDING">
        Дней, чтобы начать: {{ props.contract.daysToStart - props.contract.daysAfterTaken }}
      </p>
      <p v-if="props.contract.state === GuildContractStates.IN_PROGRESS">
        Дней до завершения: {{ props.contract.duration[0] - props.contract.daysInProgress }}
      </p>
    </div>
    <button
      v-if="props.contract.state === GuildContractStates.PENDING"
      class="contract-guild-card__start-button"
      @click="emit('click:start')"
    >
      Начать
    </button>
  </div>
</template>

<style scoped lang="scss">
.contract-guild-card {
  border: 1px solid black;
  padding: .5rem;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  &__days-left {
    display: flex;
    align-items: center;
  }
  &__start-button {
    margin-left: auto;
    font-size: 1rem;
  }
}
</style>