/**
 * @param baseChance - базовый шанс (0–1)
 * @param fails - сколько раз подряд не сработало
 * @param pityFactor - насколько быстро растет шанс (по умолчанию 0.1 = +10% от baseChance за каждый фейл)
 */
export function getChanceWithPity(baseChance: number, fails: number, pityFactor = 0.1): boolean {
  // растущий шанс
  const bonus = baseChance * pityFactor * fails;

  // итоговый шанс (не больше 100%)
  const finalChance = Math.min(baseChance + bonus, 1);

  return Math.random() < finalChance;
}
