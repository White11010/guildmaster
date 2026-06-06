<script setup lang="ts">
import { AppModals, useAppModalStore } from '@/shared/model/AppModal';
import { type Component, defineAsyncComponent } from 'vue';

const appModalStore = useAppModalStore();

const modalComponentsMap: Record<AppModals, Component> = {
  [AppModals.CHANGE_SETTINGS]: defineAsyncComponent(() =>
    import('@/features/ChangeSettings').then((m) => m.ChangeSettings)
  ),
  [AppModals.GAME_MENU]: defineAsyncComponent(() =>
    import('@/features/GameMenu').then((m) => m.GameMenu)
  ),
  [AppModals.LOAD_GAME]: defineAsyncComponent(() =>
    import('@/features/LoadGame').then((m) => m.LoadGame)
  ),
  [AppModals.ENTER_NEW_GUILD_TITLE]: defineAsyncComponent(() =>
    import('@/features/EnterNewGuildTitle').then((m) => m.EnterNewGuildTitle)
  ),
  [AppModals.ONBOARDING]: defineAsyncComponent(() =>
    import('@/features/ChooseOnboarding').then((m) => m.ChooseOnboarding)
  ),
  [AppModals.SUCCESS_SAVE]: defineAsyncComponent(() =>
    import('@/features/ShowMessage').then((m) => m.ShowSuccessfulSaveMessage)
  ),
  [AppModals.PAY_DEBTS]: defineAsyncComponent(() =>
    import('@/features/OfferPayDebts').then((m) => m.OfferPayDebtsModal)
  )
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
