<script setup lang="ts">
import { RouterView } from './providers';
import './style.css';
import { AppModalRoot } from '@/app/ui/AppModalRoot';
import { AppLayout } from '@/shared/ui/AppLayout';
import { AppModals, useAppModalStore } from '@/shared/model/AppModal';
import { useRoute } from 'vue-router';
import { ROUTE_NAME, type RouteName } from '@/shared/config';
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

type NavigationRouteName = (typeof ROUTES_WITH_HEADER_AND_NAVIGATION)[number];

function isRouteName(value: unknown): value is RouteName {
  return typeof value === 'string' && Object.values(ROUTE_NAME).includes(value as RouteName);
}

function isNavigationRouteName(value: unknown): value is NavigationRouteName {
  return (
    isRouteName(value) && ROUTES_WITH_HEADER_AND_NAVIGATION.includes(value as NavigationRouteName)
  );
}

const isNavigationRoute = computed(() => isNavigationRouteName(route.name));

const withNavigation = computed(() => isNavigationRoute.value);
const withHeader = computed(() => isNavigationRoute.value);
const withFooter = computed(() => isNavigationRoute.value);
const showMenuButton = computed(() => isNavigationRoute.value);
const showEndDayButton = computed(() => isNavigationRoute.value);
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
