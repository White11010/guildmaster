<script setup lang="ts">
import { BaseModal, type BaseModalEmits, type BaseModalProps } from "@/shared/ui/BaseModal";
import { useGameStore } from "@/entities/Game";
import { useRouter } from "vue-router";

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();
const router = useRouter();

const gameStore = useGameStore();
gameStore.loadSavedGames();

function onLoadGameClick (gameId: string) {
  gameStore.initSavedGame(gameId);
  router.push('/game');
  emit('update:modelValue', false);
}
</script>

<template>
  <base-modal
    title="Загрузить игру"
    :model-value="props.modelValue"
    with-close-button
    max-height="500px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div
      v-if="gameStore.savedGamesIds.length"
      class="load-game"
    >
      <div
        v-for="gameId in gameStore.savedGamesIds"
        :key="gameId"
        class="load-game__game"
        @click="onLoadGameClick(gameId)"
      >
        <p class="load-game__game-guild-title">
          {{ gameStore.savedGames[gameId].guild.title }}
        </p>
        <p class="load-game__game-guild-days">
          День: {{ gameStore.savedGames[gameId].game.day + 1 }}
        </p>
      </div>
    </div>
    <div
      v-else
      class="load-game__empty"
    >
      <p>
        Сохраненные игры не найдены
      </p>
    </div>
  </base-modal>
</template>

<style scoped lang="scss">
.load-game {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 370px;
  overflow: auto;

  &__game {
    padding: .5rem;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    cursor: pointer;
    &:hover {
      background-color: rgba(black, .1);
    }
  }

  &__game-guild-title {
    fill-size: 1.5rem;
  }

  &__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    padding-bottom: 2rem;
  }
}
</style>