import { GuildContractStates, type GuildContract } from "@/entities/Guild/model/Guild.types.ts";

export function normalizeGuildContract(contract: GuildContract): GuildContract {
    let actualDurationDays = contract.actualDurationDays ?? null;
    if (
        actualDurationDays === null &&
        contract.state === GuildContractStates.IN_PROGRESS
    ) {
        actualDurationDays = contract.duration[0];
    }
    return {
        ...contract,
        actualDurationDays,
    };
}
