<script setup lang="ts">
import { RouterView } from './providers';
import './style.css';
import { AppModalRoot } from '@/app/ui/AppModalRoot';
import { AppLayout } from '@/shared/ui/AppLayout';
import { AppModals, useAppModalStore } from '@/shared/model/AppModal';
import { useRoute } from 'vue-router';
import { ROUTE_NAME } from '@/shared/config';
import { computed } from 'vue';
import { useGameStore } from '@/entities/Game';
import { useGuildStore } from '@/entities/Guild';

const route = useRoute();
const appModalStore = useAppModalStore();
const gameStore = useGameStore();
const guildStore = useGuildStore();

const ROUTES_WITH_HEADER_AND_NAVIGATION = [
  ROUTE_NAME.GUILD,
  ROUTE_NAME.GUILD_CONTRACTS,
  ROUTE_NAME.GUILD_MERCENARIES,
  ROUTE_NAME.HIRING_MARKET,
  ROUTE_NAME.LOG,
  ROUTE_NAME.CONTRACTS_BOARD
];

const withNavigation = computed(() => ROUTES_WITH_HEADER_AND_NAVIGATION.includes(route.name));
const withHeader = computed(() => ROUTES_WITH_HEADER_AND_NAVIGATION.includes(route.name));
const withFooter = computed(() => ROUTES_WITH_HEADER_AND_NAVIGATION.includes(route.name));
const showMenuButton = computed(() => ROUTES_WITH_HEADER_AND_NAVIGATION.includes(route.name));
const showEndDayButton = computed(() => ROUTES_WITH_HEADER_AND_NAVIGATION.includes(route.name));
const day = computed(() => gameStore.currentGame.day);
const gold = computed(() => guildStore.money);

function onMenuButtonClick() {
  appModalStore.setCurrentModal(AppModals.GAME_MENU);
}

function shouldOfferDebtSettlement(): boolean {
  const withDebt = guildStore.mercenaries.filter((mercenary) => mercenary.debt > 0);
  if (!withDebt.length || guildStore.money <= 0) {
    return false;
  }
  return withDebt.some((mercenary) => mercenary.debt <= guildStore.money);
}

function onEndDayButtonClick() {
  gameStore.finishDay();
  if (shouldOfferDebtSettlement()) {
    appModalStore.setCurrentModal(AppModals.PAY_DEBTS);
  }
}
</script>

<template>
  <app-layout
    :with-navigation="withNavigation"
    :with-header="withHeader"
    :with-footer="withFooter"
    :show-menu-button="showMenuButton"
    :show-end-day-button="showEndDayButton"
    :day="day"
    :gold="gold"
    @click:menu="onMenuButtonClick"
    @click:end-day="onEndDayButtonClick"
  >
    <router-view />
  </app-layout>

  <app-modal-root />
</template>
