import type { Mercenary } from "@/entities/Mercenary";
import type { BoardContract } from "@/entities/ContractsBoard";

export enum CurrentContractStates {
    PENDING,
    IN_PROGRESS
}

export interface CurrentContracts extends BoardContract {
    state: CurrentContractStates;
    mercenaries: Array<Mercenary>;
}

export interface GuildMercenary extends Mercenary {
    daysInGuild: number;
}

export interface Guild {
    title: string;
    mercenaries: Array<GuildMercenary>;
    money: number;
    currentContracts: Array<CurrentContractStates>;
    fame: number;
    reputation: number;
}