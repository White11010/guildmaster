export function getRandomItems<T>(array: T[], n: number): T[] {
  if (n <= 0) return [];

  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, Math.min(n, copy.length));
}
