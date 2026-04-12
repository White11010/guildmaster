<script setup lang="ts">
import type { GuildMercenary } from "@/entities/Guild";
import {
    getGuildMercenaryBasePower,
    getGuildMercenaryContractPower,
} from "@/entities/Guild/lib/getGuildMercenaryContractPower.ts";
import { ClassesTitles, SpeciesTitles } from "@/entities/Mercenary";

const props = defineProps<{
  mercenary: GuildMercenary;
  isSelected: boolean;
}>();
const emit = defineEmits<{
  (e: 'click:select', mercenary: GuildMercenary): void;
  (e: 'click:cancel', mercenary: GuildMercenary): void;
}>();

function onSelectButtonClick () {
  if (props.isSelected) {
    emit('click:cancel', props.mercenary);
  } else {
    emit('click:select', props.mercenary);
  }
}
</script>

<template>
  <div class="guild-mercenary-assignment-card">
    <div class="guild-mercenary-assignment-card__info">
      <p>{{ props.mercenary.name }}</p>
      <div class="guild-mercenary-assignment-card__full-info-block">
        <div class="guild-mercenary-assignment-card__info-block">
          <p>Класс:</p>
          <p>{{ ClassesTitles[props.mercenary.class] }}</p>
        </div>
        <div class="guild-mercenary-assignment-card__info-block">
          <p>Вид:</p>
          <p>{{ SpeciesTitles[props.mercenary.species] }}</p>
        </div>
        <div class="guild-mercenary-assignment-card__info-block">
          <p>Базовая сила:</p>
          <p>{{ getGuildMercenaryBasePower(props.mercenary) }}</p>
        </div>
      </div>
      <div class="guild-mercenary-assignment-card__full-info-block">
        <div class="guild-mercenary-assignment-card__info-block">
          <p>Уровень:</p>
          <p>{{ props.mercenary.level }}</p>
        </div>
        <div class="guild-mercenary-assignment-card__info-block">
          <p>Сила в контракте:</p>
          <p>{{ getGuildMercenaryContractPower(props.mercenary).toFixed(1) }}</p>
        </div>
      </div>
    </div>
    <div class="guild-mercenary-assignment-card__footer">
      <button
        class="guild-mercenary-assignment-card__button"
        @click="onSelectButtonClick"
      >
        {{ props.isSelected ? 'Отменить' : 'Выбрать' }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.guild-mercenary-assignment-card {
  border: 1px solid black;
  padding: .5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  &__full-info-block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  &__info-block {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  &__footer {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  &__button {
    font-size: 1.5rem;
  }
}
</style>