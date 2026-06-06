import type { Guild } from '@/entities/Guild';
import type { ContractsBoard } from '@/entities/ContractsBoard';
import type { HiringMarket } from '@/entities/HiringMarket';
import type { LogEvent } from '@/entities/Log';

export interface CurrentGame {
  day: number;
  daysWithoutNewMercenaries: number;
  daysWithoutNewContracts: number;
}

export interface SavedGame {
  guild: Guild;
  contractsBoard: ContractsBoard;
  hiringMarket: HiringMarket;
  updatedAt: number;
  game: CurrentGame;
  log?: LogEvent[];
}
