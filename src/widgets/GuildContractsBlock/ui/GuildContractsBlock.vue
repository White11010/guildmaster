<script setup lang="ts">
import { BaseContentBlock } from "@/shared/ui/BaseContentBlock";
import { GuildContractCard, useGuildStore } from "@/entities/Guild";

const guildStore = useGuildStore();
</script>

<template>
  <base-content-block title="Активные контракты">
    <div
      v-if="guildStore.currentContracts && guildStore.currentContracts.length"
      class="guild-contracts-block"
    >
      <guild-contract-card
        v-for="contract in guildStore.currentContracts"
        :key="contract.id"
        :contract="contract"
      />
    </div>
    <div
      v-else
      class="guild-mercenaries-block__empty"
    >
      <p>Пока у вас нет наемников</p>
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">

</style>