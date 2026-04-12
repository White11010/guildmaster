import {
    GUILD_MERCENARY_MORAL_MAX,
    GUILD_MERCENARY_MORAL_MIN,
} from "@/entities/Guild/config/GuildMercenary.config.ts";

export function clampGuildMercenaryMoral(moral: number): number {
    return Math.min(
        GUILD_MERCENARY_MORAL_MAX,
        Math.max(GUILD_MERCENARY_MORAL_MIN, moral),
    );
}
