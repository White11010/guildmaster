import type { Mercenary } from '@/entities/Mercenary';

export interface HiringMarket {
  title: string;
  mercenaries: Mercenary[];
}
