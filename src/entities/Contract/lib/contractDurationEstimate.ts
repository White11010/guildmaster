/** Оценка длительности для карточки на доске: среднее между min и max из `duration`. */
export function getContractEstimatedDurationDays(
    duration: readonly [number, number],
): number {
    return Math.ceil((duration[0] + duration[1]) / 2);
}
