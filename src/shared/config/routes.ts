/**
 * Единый источник путей и имён маршрутов (shared-слой FSD: без импортов из pages/app).
 */
export const ROUTE_PATH = {
  MENU: '/',
  GUILD: '/guild',
  GUILD_CONTRACTS: '/guild/contracts',
  GUILD_MERCENARIES: '/guild/mercenaries',
  HIRING_MARKET: '/hiring-market',
  CONTRACTS_BOARD: '/contracts-board',
  LOG: '/log'
} as const;

export type RoutePath = (typeof ROUTE_PATH)[keyof typeof ROUTE_PATH];

export const ROUTE_NAME = {
  MENU: 'menu',
  GUILD: 'guild',
  GUILD_CONTRACTS: 'guild-contracts',
  GUILD_MERCENARIES: 'guild-mercenaries',
  HIRING_MARKET: 'hiring-market',
  CONTRACTS_BOARD: 'contracts-board',
  LOG: 'log'
} as const;

export type RouteName = (typeof ROUTE_NAME)[keyof typeof ROUTE_NAME];
