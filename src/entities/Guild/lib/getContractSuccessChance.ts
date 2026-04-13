import {
  CONTRACT_SUCCESS_CHANCE_AT_75_PERCENT_SQUAD,
  CONTRACT_SUCCESS_CHANCE_AT_DOUBLE_POWER,
  CONTRACT_SUCCESS_CHANCE_AT_EQUAL_POWER,
  CONTRACT_SUCCESS_SQUAD_RATIO_FOR_100_PERCENT,
  CONTRACT_SUCCESS_SQUAD_RATIO_FOR_50_PERCENT,
  CONTRACT_SUCCESS_SQUAD_RATIO_FOR_90_PERCENT
} from '@/entities/Guild/config/GuildContract.config.ts';

/**
 * Вероятность успеха контракта по отношению силы отряда к требуемой силе контракта.
 * Два линейных участка: [0.75, 1] → [50%, 90%], [1, 2] → [90%, 100%]; при R ≥ 2 — 100%, при R < 0.75 — продолжение нижнего участка с отсечкой в [0, 1].
 */
export function getContractSuccessChance(squadPower: number, requiredPower: number): number {
  if (requiredPower <= 0) {
    return 1;
  }
  const R = squadPower / requiredPower;

  if (R >= CONTRACT_SUCCESS_SQUAD_RATIO_FOR_100_PERCENT) {
    return CONTRACT_SUCCESS_CHANCE_AT_DOUBLE_POWER;
  }
  if (R >= CONTRACT_SUCCESS_SQUAD_RATIO_FOR_90_PERCENT) {
    const span =
      CONTRACT_SUCCESS_SQUAD_RATIO_FOR_100_PERCENT - CONTRACT_SUCCESS_SQUAD_RATIO_FOR_90_PERCENT;
    const t = (R - CONTRACT_SUCCESS_SQUAD_RATIO_FOR_90_PERCENT) / span;
    return (
      CONTRACT_SUCCESS_CHANCE_AT_EQUAL_POWER +
      t * (CONTRACT_SUCCESS_CHANCE_AT_DOUBLE_POWER - CONTRACT_SUCCESS_CHANCE_AT_EQUAL_POWER)
    );
  }
  const lowSpan =
    CONTRACT_SUCCESS_SQUAD_RATIO_FOR_90_PERCENT - CONTRACT_SUCCESS_SQUAD_RATIO_FOR_50_PERCENT;
  const chance =
    CONTRACT_SUCCESS_CHANCE_AT_75_PERCENT_SQUAD +
    ((R - CONTRACT_SUCCESS_SQUAD_RATIO_FOR_50_PERCENT) / lowSpan) *
      (CONTRACT_SUCCESS_CHANCE_AT_EQUAL_POWER - CONTRACT_SUCCESS_CHANCE_AT_75_PERCENT_SQUAD);
  return Math.max(0, Math.min(1, chance));
}
