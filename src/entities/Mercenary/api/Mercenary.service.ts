import type { Mercenary } from "@/entities/Mercenary";
import { getRandomItems } from "@/shared/lib/random";
import { mercenaries } from "@/mocks/mercanaries.ts";

export const mercenaryService = {
    getRandomMercenaries (amount: number, idsToExclude: Array<string> = []): Array<Mercenary> {
        return getRandomItems(mercenaries.filter(mercenary => !idsToExclude.includes(mercenary.id)), amount);
    }
};