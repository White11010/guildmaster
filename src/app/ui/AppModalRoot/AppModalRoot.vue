<script setup lang="ts">
import { ChangeSettings } from '@/features/ChangeSettings';
import { ChooseOnboarding } from '@/features/ChooseOnboarding';
import { EnterNewGuildTitle } from '@/features/EnterNewGuildTitle';
import { GameMenu } from '@/features/GameMenu';
import { LoadGame } from '@/features/LoadGame';
import { OfferPayDebtsModal } from '@/features/OfferPayDebts';
import { ShowSuccessfulSaveMessage } from '@/features/ShowMessage';
import { AppModals, useAppModalStore } from '@/shared/model/AppModal';
import type { Component } from 'vue';

const appModalStore = useAppModalStore();

const modalComponentsMap: Record<AppModals, Component> = {
  [AppModals.CHANGE_SETTINGS]: ChangeSettings,
  [AppModals.GAME_MENU]: GameMenu,
  [AppModals.LOAD_GAME]: LoadGame,
  [AppModals.ENTER_NEW_GUILD_TITLE]: EnterNewGuildTitle,
  [AppModals.ONBOARDING]: ChooseOnboarding,
  [AppModals.SUCCESS_SAVE]: ShowSuccessfulSaveMessage,
  [AppModals.PAY_DEBTS]: OfferPayDebtsModal
};

function onUpdateModelValue(value: boolean): void {
  if (!value) {
    appModalStore.closeModal();
  }
}

function onSettingsClick(): void {
  appModalStore.setCurrentModal(AppModals.CHANGE_SETTINGS);
}

function onLoadClick(): void {
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
