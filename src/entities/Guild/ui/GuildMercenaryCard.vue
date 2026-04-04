<script setup lang="ts">
import type { GuildMercenary } from "@/entities/Guild";
import { ClassesTitles, SpeciesTitles } from "@/entities/Mercenary";
import { BaseLabelValueBlock } from "@/shared/ui/BaseLabelValueBlock";

const props = defineProps<{
  mercenary: GuildMercenary;
}>();
</script>

<template>
  <div class="mercenary-guild-card">
    <p class="mercenary-guild-card__name">
      {{ props.mercenary.name }}
    </p>
    <div class="mercenary-guild-card__main-info">
      <p>
        {{ ClassesTitles[props.mercenary.class] }}
      </p>
      <p>
        {{ SpeciesTitles[props.mercenary.species] }}
      </p>
      <p>{{ props.mercenary.level }} уровень</p>
    </div>
    <div class="mercenary-guild-card__salary-info">
      <base-label-value-block
        :value="props.mercenary.salary"
        :label="'Зарплата в неделю'"
      />
    </div>
    <base-label-value-block
      :value="props.mercenary.salary"
      :label="'Дней в гильдии'"
    />
  </div>
</template>

<style scoped lang="scss">
.mercenary-guild-card {
  border: 1px solid black;
  padding: .5rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  &__name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  &__main-info {
    display: grid;
    gap: .5rem;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>