import { GuildContractStates } from "@/entities/Guild";

export const GuildContractStatesTitles: Record<GuildContractStates, string> = {
    [GuildContractStates.PENDING]: 'Не начат',
    [GuildContractStates.IN_PROGRESS]: 'В процессе',
    [GuildContractStates.COMPLETED]: 'Выполнен',
    [GuildContractStates.OVERDUE]: 'Просрочен',
    [GuildContractStates.FAILED]: 'Провален'
};