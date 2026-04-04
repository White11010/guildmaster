import type { Mercenary } from "@/entities/Mercenary";
import type { BoardContract } from "@/entities/ContractsBoard";

export enum GuildContractStates {
    PENDING,
    IN_PROGRESS,
    OVERDUE,
    COMPLETED,
    FAILED,
}

export interface GuildContract extends BoardContract {
    state: GuildContractStates;
    mercenaries: Array<Mercenary>;
    power: number;
    daysAfterTaken: number;
    daysInProgress: number;
}

export interface GuildMercenary extends Mercenary {
    daysInGuild: number;
    debt: number
}

export interface Guild {
    title: string;
    mercenaries: Array<GuildMercenary>;
    money: number;
    currentContracts: Array<GuildContract>;
    fame: number;
    reputation: number;
}