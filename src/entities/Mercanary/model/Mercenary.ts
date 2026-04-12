export enum Species {
    HUMAN,
    DWARF,
    ELF
}

export enum Classes {
    FIGHTER,
    ROGUE,
    RANGER,
    WIZARD,
    BARBARIAN,
}

export type MercanaryLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface Mercanary {
    name: string;
    age: number;
    species: Species;
    class: Classes;
    level: MercanaryLevel
}