import { createRouter, createWebHistory } from 'vue-router';
import { ROUTE_NAME, ROUTE_PATH } from '@/shared/config';

export const routes = [
  {
    path: ROUTE_PATH.MENU,
    name: ROUTE_NAME.MENU,
    component: () => import('@/pages/Menu/ui/MenuPage.vue')
  },
  {
    path: ROUTE_PATH.GUILD,
    name: ROUTE_NAME.GUILD,
    component: () => import('@/pages/Guild/ui/GuildPage.vue')
  },
  {
    path: ROUTE_PATH.GUILD_CONTRACTS,
    name: ROUTE_NAME.GUILD_CONTRACTS,
    component: () => import('@/pages/GuildContracts/ui/GuildContractsPage.vue')
  },
  {
    path: ROUTE_PATH.GUILD_MERCENARIES,
    name: ROUTE_NAME.GUILD_MERCENARIES,
    component: () => import('@/pages/GuildMercenaries/ui/GuildMercenariesPage.vue')
  },
  {
    path: ROUTE_PATH.HIRING_MARKET,
    name: ROUTE_NAME.HIRING_MARKET,
    component: () => import('@/pages/HiringMarket/ui/HiringMarketPage.vue')
  },
  {
    path: ROUTE_PATH.CONTRACTS_BOARD,
    name: ROUTE_NAME.CONTRACTS_BOARD,
    component: () => import('@/pages/ContractsBoard/ui/ContractsBoardPage.vue')
  },
  {
    path: ROUTE_PATH.LOG,
    name: ROUTE_NAME.LOG,
    component: () => import('@/pages/Log/ui/LogPage.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
