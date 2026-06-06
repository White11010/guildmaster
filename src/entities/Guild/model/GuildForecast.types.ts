export interface ForecastDayCard {
  dayLabel: string;
  dayNumber: number;
  startGold: number;
  endGold: number;
  income: number;
  expenses: number;
  delta: number;
  salaryEvents: number;
  contractEvents: number;
}

export interface ContractStartPreview {
  squadPower: number;
  minSquadPower: number;
  minSquadPowerRatioPercent: number;
  canStart: boolean;
  successChancePercent: number | null;
}
