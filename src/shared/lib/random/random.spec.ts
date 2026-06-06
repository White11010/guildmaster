import { afterEach, describe, expect, it, vi } from 'vitest';
import { chance } from '@/shared/lib/random/chance.ts';
import { getChanceWithPity } from '@/shared/lib/random/getChanceWithPity.ts';
import { getRandomItems } from '@/shared/lib/random/getRandomItems.ts';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('chance', () => {
  it('returns false at or below 0 and true at or above 1 without rolling', () => {
    expect(chance(0)).toBe(false);
    expect(chance(-1)).toBe(false);
    expect(chance(1)).toBe(true);
    expect(chance(2)).toBe(true);
  });

  it('compares the roll against the probability', () => {
    const random = vi.spyOn(Math, 'random');
    random.mockReturnValue(0.4);
    expect(chance(0.5)).toBe(true);
    random.mockReturnValue(0.6);
    expect(chance(0.5)).toBe(false);
  });
});

describe('getChanceWithPity', () => {
  it('raises the effective chance as the fail streak grows', () => {
    const random = vi.spyOn(Math, 'random');
    // base 0.5, 4 fails, pity 0.1 => 0.5 + 0.5*0.1*4 = 0.7
    random.mockReturnValue(0.69);
    expect(getChanceWithPity(0.5, 4)).toBe(true);
    random.mockReturnValue(0.71);
    expect(getChanceWithPity(0.5, 4)).toBe(false);
  });

  it('clamps the final chance at 1', () => {
    const random = vi.spyOn(Math, 'random');
    random.mockReturnValue(0.999);
    expect(getChanceWithPity(1, 100)).toBe(true);
  });
});

describe('getRandomItems', () => {
  it('returns at most the requested amount of items from the source', () => {
    const source = [1, 2, 3, 4, 5];
    const picked = getRandomItems(source, 3);
    expect(picked).toHaveLength(3);
    picked.forEach((item) => {
      expect(source).toContain(item);
    });
  });
});
