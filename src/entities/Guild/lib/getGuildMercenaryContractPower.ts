import { GUILD_MERCENARY_MORAL_MAX } from "@/entities/Guild/config/GuildMercenary.config.ts";
import type { GuildMercenary } from "@/entities/Guild/model/Guild.types.ts";

const BASE_POWER_PER_LEVEL = 25;

export function getGuildMercenaryBasePower(mercenary: { level: number }): number {
    return mercenary.level * BASE_POWER_PER_LEVEL;
}

/** Сила наёмника в контракте: базовая сила × (мораль / максимум морали). */
export function getGuildMercenaryContractPower(mercenary: GuildMercenary): number {
    return getGuildMercenaryBasePower(mercenary) * (mercenary.moral / GUILD_MERCENARY_MORAL_MAX);
}
