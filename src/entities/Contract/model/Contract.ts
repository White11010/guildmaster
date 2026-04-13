import type { Item } from '@/entities/Item';

export interface Contract {
  id: string;
  title: string;
  description: string;
  customer: string;
  reward: {
    money: number;
    items: Item[];
  };
  prepayment: number;
  difficulty: number;
  duration: [number, number];
}
