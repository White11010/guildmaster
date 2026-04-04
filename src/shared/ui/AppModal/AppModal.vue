<script setup lang="ts">
import type { Component } from "vue";
import { ChangeSettings } from "@/features/ChangeSettings";
import { GameMenu } from "@/features/GameMenu";
import { LoadGame } from "@/features/LoadGame";
import { EnterNewGuildTitle } from "@/features/EnterNewGuildTitle";
import { AppModals, useAppModalStore } from "@/shared/model/AppModal";

const appModalStore = useAppModalStore();

const modalComponentsMap: Record<AppModals, Component> = {
  [AppModals.CHANGE_SETTINGS]: ChangeSettings,
  [AppModals.GAME_MENU]: GameMenu,
  [AppModals.LOAD_GAME]: LoadGame,
  [AppModals.ENTER_NEW_GUILD_TITLE]: EnterNewGuildTitle
};

function onUpdateModelValue (value: boolean) {
  if (!value) {
    appModalStore.closeModal();
  }
}
function onSettingsClick () {
  appModalStore.setCurrentModal(AppModals.CHANGE_SETTINGS);
}
function onLoadClick () {
  appModalStore.setCurrentModal(AppModals.LOAD_GAME);
}
</script>

<template>
  <component
    :is="modalComponentsMap[appModalStore.currentModal]"
    v-if="appModalStore.currentModal !== null"
    :model-value="true"
    @update:model-value="onUpdateModelValue"
    @click:settings="onSettingsClick"
    @click:load="onLoadClick"
  />
</template>

<style scoped lang="scss">

</style>