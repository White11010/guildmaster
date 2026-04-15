import { createRouter, createWebHistory } from 'vue-router';
import MenuPage from '@/pages/Menu/ui/MenuPage.vue';
import GuildPage from '@/pages/Guild/ui/GuildPage.vue';
import GuildContractsPage from '@/pages/GuildContracts/ui/GuildContractsPage.vue';
import GuildMercenariesPage from '@/pages/GuildMercenaries/ui/GuildMercenariesPage.vue';
import HiringMarketPage from '@/pages/HiringMarket/ui/HiringMarketPage.vue';
import ContractsBoardPage from '@/pages/ContractsBoard/ui/ContractsBoardPage.vue';
import LogPage from '@/pages/Log/ui/LogPage.vue';
import { ROUTE_NAME, ROUTE_PATH } from '@/shared/config';

export const routes = [
  {
    path: ROUTE_PATH.MENU,
    name: ROUTE_NAME.MENU,
    component: MenuPage
  },
  {
    path: ROUTE_PATH.GUILD,
    name: ROUTE_NAME.GUILD,
    component: GuildPage
  },
  {
    path: ROUTE_PATH.GUILD_CONTRACTS,
    name: ROUTE_NAME.GUILD_CONTRACTS,
    component: GuildContractsPage
  },
  {
    path: ROUTE_PATH.GUILD_MERCENARIES,
    name: ROUTE_NAME.GUILD_MERCENARIES,
    component: GuildMercenariesPage
  },
  {
    path: ROUTE_PATH.HIRING_MARKET,
    name: ROUTE_NAME.HIRING_MARKET,
    component: HiringMarketPage
  },
  {
    path: ROUTE_PATH.CONTRACTS_BOARD,
    name: ROUTE_NAME.CONTRACTS_BOARD,
    component: ContractsBoardPage
  },
  {
    path: ROUTE_PATH.LOG,
    name: ROUTE_NAME.LOG,
    component: LogPage
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
