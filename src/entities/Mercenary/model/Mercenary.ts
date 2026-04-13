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
  BARBARIAN
}

export type MercenaryLevel = 1 | 2 | 3 | 4 | 5 | 6;

export enum Alignments {
  LAWFUL_GOOD,
  NEUTRAL_GOOD,
  CHAOTIC_GOOD,
  LAWFUL_NEUTRAL,
  TRUE_NEUTRAL,
  CHAOTIC_NEUTRAL,
  LAWFUL_EVIL,
  NEUTRAL_EVIL,
  CHAOTIC_EVIL
}

export enum Genders {
  MALE,
  FEMALE
}

export interface Mercenary {
  id: string;
  name: string;
  age: number;
  gender: Genders;
  background: string;
  species: Species;
  class: Classes;
  level: MercenaryLevel;
  alignment: Alignments;
  salary: number;
  price: number;
}
