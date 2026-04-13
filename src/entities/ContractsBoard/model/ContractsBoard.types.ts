import type { Contract } from '@/entities/Contract';

export interface BoardContract extends Contract {
  availableOnBoardDuring: number;
  isUrgent: boolean;
  daysToStart: number;
}

export interface ContractsBoard {
  contracts: BoardContract[];
}
