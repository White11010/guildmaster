<script setup lang="ts">
import { BaseContentBlock } from "@/shared/ui/BaseContentBlock";
import { GuildContractStates, useGuildStore } from "@/entities/Guild";
import { BaseLabelValueBlock } from "@/shared/ui/BaseLabelValueBlock";

const guildStore = useGuildStore();
</script>

<template>
  <base-content-block title="Гильдия">
    <div class="guild-block">
      <p class="guild-block__title">
        {{ guildStore.title }}
      </p>
      <div class="guild-block__gold-block">
        <p class="guild-block__gold-block-label">
          Золото:
        </p>
        <p class="guild-block__gold-block-value">
          {{ guildStore.money }}
        </p>
      </div>
      <div class="guild-block__info">
        <base-label-value-block
          :value="guildStore.fame"
          label="Известность"
        />
        <base-label-value-block
          :value="guildStore.reputation"
          label="Репутация"
        />
        <base-label-value-block
          :value="guildStore.currentContracts.filter(contract => contract.state === GuildContractStates.COMPLETED).length"
          label="Контрактов выполнено"
        />
        <base-label-value-block
          :value="guildStore.currentContracts.filter(contract => [GuildContractStates.FAILED, GuildContractStates.OVERDUE].includes(contract.state)).length"
          label="Контрактов провалено"
        />
      </div>
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">
.guild-block {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__title {
    font-size: 1.5rem;
  }

  &__gold-block {
    display: flex;
    align-items: center;
    gap: .5rem;
  }
  &__gold-block-label {
    font-size: 1.5rem;
    text-decoration: underline;
  }
  &__gold-block-value {
    font-size: 1.5rem;
    font-weight: bold;
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 2rem;
    gap: 1rem;
  }
}
</style>