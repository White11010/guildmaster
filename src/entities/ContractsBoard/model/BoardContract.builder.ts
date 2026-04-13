import type { Contract } from '@/entities/Contract';
import type { BoardContract } from '@/entities/ContractsBoard';
import { chance, getRandomInt } from '@/shared/lib/random';

export function buildBoardContract(contract: Contract): BoardContract {
  return {
    ...contract,
    isUrgent: chance(0.2),
    availableOnBoardDuring: getRandomInt(1, 7),
    daysToStart: getRandomInt(1, 7)
  };
}
