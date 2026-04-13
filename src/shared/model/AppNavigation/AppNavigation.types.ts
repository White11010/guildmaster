export enum AppNavigationItems {
  GUILD,
  GUILD_CONTRACTS,
  GUILD_MERCENARIES,
  CONTRACTS_BOARD,
  HIRING_MARKET,
  LOG
}

export interface AppNavigationItem {
  title: string;
  path: string;
  id: AppNavigationItems;
}
