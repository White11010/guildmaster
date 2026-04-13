import type { Mercenary } from '@/entities/Mercenary';
import type { BoardContract } from '@/entities/ContractsBoard';

export enum GuildContractStates {
  PENDING,
  IN_PROGRESS,
  OVERDUE,
  COMPLETED,
  FAILED
}

export interface GuildContract extends BoardContract {
  state: GuildContractStates;
  mercenaries: Mercenary[];
  power: number;
  daysAfterTaken: number;
  daysInProgress: number;
  /**
   * Фактическая длительность выполнения (дней в работе до итога).
   * Задаётся случайно при старте контракта, пользователю на доске не показывается.
   */
  actualDurationDays: number | null;
}

export interface GuildMercenary extends Mercenary {
  daysInGuild: number;
  debt: number;
  /** Сколько дней подряд у наёмника есть долг по зарплате (debt > 0). */
  debtDays: number;
  moral: number;
}

export interface Guild {
  title: string;
  mercenaries: GuildMercenary[];
  money: number;
  currentContracts: GuildContract[];
  fame: number;
  reputation: number;
}
