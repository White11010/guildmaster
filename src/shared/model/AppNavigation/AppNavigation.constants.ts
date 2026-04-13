import { ROUTE_PATH } from '@/shared/config';
import { type AppNavigationItem, AppNavigationItems } from './AppNavigation.types';

export const appNavigationItems: Array<AppNavigationItem> = [
    {
        title: 'Гильдия',
        path: ROUTE_PATH.GUILD,
        id: AppNavigationItems.GUILD,
    },
    {
        title: 'Контракты',
        path: ROUTE_PATH.GUILD_CONTRACTS,
        id: AppNavigationItems.GUILD_CONTRACTS,
    },
    {
        title: 'Отряд',
        path: ROUTE_PATH.GUILD_MERCENARIES,
        id: AppNavigationItems.GUILD_MERCENARIES,
    },
    {
        title: 'Таверна',
        path: ROUTE_PATH.HIRING_MARKET,
        id: AppNavigationItems.HIRING_MARKET,
    },
    {
        title: 'Доска заказов',
        path: ROUTE_PATH.CONTRACTS_BOARD,
        id: AppNavigationItems.CONTRACTS_BOARD,
    },
    {
        title: 'Журнал',
        path: ROUTE_PATH.LOG,
        id: AppNavigationItems.LOG,
    },
]; 