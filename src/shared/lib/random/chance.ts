export function chance (probability: number): boolean {
    if (probability <= 0) return false;
    if (probability >= 1) return true;

    return Math.random() < probability;
}