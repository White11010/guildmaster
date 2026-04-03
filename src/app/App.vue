<script setup lang="ts">
import { RouterView } from './providers';
import './style.css';
import { AppLayout } from "@/shared/ui/AppLayout";
import { useGameStore } from "@/entities/Game";
import { SettingsModal } from "@/features/SettingsModal";
import { ref } from "vue";

const gameStore = useGameStore();

const isSettingsModalOpen = ref(false);
function onMenuButtonClick () {
  gameStore.saveGame();
  isSettingsModalOpen.value = true;

}
</script>

<template>
  <app-layout @click:menu="onMenuButtonClick">
    <router-view />
  </app-layout>

  <settings-modal v-model="isSettingsModalOpen" />
</template>
