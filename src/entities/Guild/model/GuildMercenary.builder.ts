import { GUILD_MERCENARY_INITIAL_MORAL } from "@/entities/Guild/config/GuildMercenary.config.ts";
import { clampGuildMercenaryMoral } from "@/entities/Guild/lib/guildMercenaryMoral.ts";
import type { GuildMercenary } from "@/entities/Guild/model/Guild.types.ts";
import type { Mercenary } from "@/entities/Mercenary";

export function buildGuildMercenary(mercenary: Mercenary): GuildMercenary {
    return {
        ...mercenary,
        debt: 0,
        debtDays: 0,
        daysInGuild: 0,
        moral: clampGuildMercenaryMoral(GUILD_MERCENARY_INITIAL_MORAL),
    };
}

export function normalizeGuildMercenary(mercenary: GuildMercenary): GuildMercenary {
    return {
        ...mercenary,
        debtDays: mercenary.debtDays ?? 0,
        moral: clampGuildMercenaryMoral(
            typeof mercenary.moral === "number" ? mercenary.moral : GUILD_MERCENARY_INITIAL_MORAL,
        ),
    };
}