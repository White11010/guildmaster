import type { BoardContract } from "@/entities/ContractsBoard";
import { type GuildContract, GuildContractStates } from "@/entities/Guild";
import { getRandomInt } from "@/shared/lib/random";

export function buildGuildContract (boardContract: BoardContract): GuildContract {
    return {
        ...boardContract,
        state: GuildContractStates.PENDING,
        mercenaries: [],
        power: getRandomInt(75, 125) * boardContract.difficulty,
        daysAfterTaken: 0,
        daysInProgress: 0,
        actualDurationDays: null,
    };
}