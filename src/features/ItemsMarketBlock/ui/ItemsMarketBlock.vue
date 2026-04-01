<script setup lang="ts">

import { BaseContentBlock } from "@/shared/ui/BaseContentBlock";
</script>

<template>
  <base-content-block title="Рынок предметов">
    <div class="items-market-block">
      <p>Пока здесь ничего нет</p>
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">
.items-market-block {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}
</style>