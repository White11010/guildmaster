<script setup lang="ts">
import { RouterView } from './providers';
import './style.css';
import { AppLayout } from "@/shared/ui/AppLayout";
import { useGameStore } from "@/entities/Game";

const gameStore = useGameStore();
function onMenuButtonClick () {
  console.log('clicked menu button');
  console.log(gameStore);
  gameStore.saveGame();
}
</script>

<template>
  <app-layout @click:menu="onMenuButtonClick">
    <router-view />
  </app-layout>
</template>
