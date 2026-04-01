<script setup lang="ts">
import { BaseContentBlock } from "@/shared/ui/BaseContentBlock";
import { useGuildStore } from "@/entities/Guild";

const guildStore = useGuildStore();
</script>

<template>
  <base-content-block title="Гильдия">
    <div class="guild-block">
      <div class="guild-block__info-block">
        <p class="guild-block__info-block-label">
          Название:
        </p>
        <p class="guild-block__info-block-value">
          {{ guildStore.title }}
        </p>
      </div>
      <div class="guild-block__info-block">
        <p class="guild-block__info-block-label">
          Золото:
        </p>
        <p class="guild-block__info-block-value">
          {{ guildStore.money }}
        </p>
      </div>
      <div class="guild-block__info-block">
        <p class="guild-block__info-block-label">
          Известность:
        </p>
        <p class="guild-block__info-block-value">
          {{ guildStore.fame }}
        </p>
      </div>
      <div class="guild-block__info-block">
        <p class="guild-block__info-block-label">
          Репутация:
        </p>
        <p class="guild-block__info-block-value">
          {{ guildStore.reputation }}
        </p>
      </div>
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">
.guild-block {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  &__info-block {
    display: flex;
    gap: .5rem;
  }
}
</style>