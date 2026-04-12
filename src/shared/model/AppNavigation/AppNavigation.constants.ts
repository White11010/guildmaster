import { ROUTE_PATH } from '@/shared/config';
import { type AppNavigationItem, AppNavigationItems } from './AppNavigation.types';

export const appNavigationItems: Array<AppNavigationItem> = [
    {
        title: 'Гильдия',
        path: ROUTE_PATH.GUILD,
        id: AppNavigationItems.GUILD,
    },
    {
        title: 'Контракты гильдии',
        path: ROUTE_PATH.GUILD_CONTRACTS,
        id: AppNavigationItems.GUILD_CONTRACTS,
    },
    {
        title: 'Наемники гильдии',
        path: ROUTE_PATH.GUILD_MERCENARIES,
        id: AppNavigationItems.GUILD_MERCENARIES,
    },
    {
        title: 'Рынок наемников',
        path: ROUTE_PATH.HIRING_MARKET,
        id: AppNavigationItems.HIRING_MARKET,
    },
    {
        title: 'Доска контрактов',
        path: ROUTE_PATH.CONTRACTS_BOARD,
        id: AppNavigationItems.CONTRACTS_BOARD,
    },
    {
        title: 'Журнал событий',
        path: ROUTE_PATH.LOG,
        id: AppNavigationItems.LOG,
    },
]; 