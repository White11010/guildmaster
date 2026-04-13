export enum LogEventTypes {
  NEW_MERCENARY,
  NEW_CONTRACT,
  MERCENARY_MORALE,
  MERCENARY_LEFT_GUILD,
  CONTRACT_COMPLETED,
  CONTRACT_FAILED,
  CONTRACT_OVERDUE
}

export interface LogEvent {
  id: string;
  text: string;
  type: LogEventTypes;
  /** Игровой день, в котором произошло событие (для группировки в ленте). */
  day?: number;
}
