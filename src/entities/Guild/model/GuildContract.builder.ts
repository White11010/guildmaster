import type { BoardContract } from "@/entities/ContractsBoard";
import { type GuildContract, GuildContractStates } from "@/entities/Guild";

export function buildGuildContract (boardContract: BoardContract): GuildContract {
    return {
        ...boardContract,
        state: GuildContractStates.PENDING,
        mercenaries: []
    };
}