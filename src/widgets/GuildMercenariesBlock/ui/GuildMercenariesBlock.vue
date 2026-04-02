<script setup lang="ts">
import { BaseContentBlock } from "@/shared/ui/BaseContentBlock";
import { MercenaryGuildCard } from "@/entities/Mercenary";
import { useGuildStore } from "@/entities/Guild";

const guildStore = useGuildStore();
</script>

<template>
  <base-content-block title="Наемники гильдии">
    <div
      v-if="guildStore.mercenaries && guildStore.mercenaries.length"
      class="guild-mercenaries-block"
    >
      <mercenary-guild-card
        v-for="mercenary in guildStore.mercenaries"
        :key="mercenary.id"
        :mercenary="mercenary"
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