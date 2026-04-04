<script setup lang="ts">
import { RouterView } from './providers';
import './style.css';
import { AppLayout } from "@/shared/ui/AppLayout";
import { AppModals, useAppModalStore } from "@/shared/model/AppModal";
import { AppModal } from "@/shared/ui/AppModal";

const appModalStore = useAppModalStore();

function onMenuButtonClick () {
  appModalStore.setCurrentModal(AppModals.GAME_MENU);
}
</script>

<template>
  <app-layout @click:menu="onMenuButtonClick">
    <router-view />
  </app-layout>

  <app-modal />
</template>
