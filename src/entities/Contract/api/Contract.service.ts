import type { Contract } from "@/entities/Contract";
import { getRandomItems } from "@/shared/lib/random";
import { contracts } from "@/mocks/contracts.ts";

export const contractService = {
    getRandomContracts (amount: number, idsToExclude: Array<string>): Array<Contract> {
        return getRandomItems(contracts.filter(contract => !idsToExclude.includes(contract.id)), amount);
    }
};