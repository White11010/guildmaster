import { Alignments, Classes, Genders, type Mercenary, Species } from '@/entities/Mercenary';
import { type GuildContract, GuildContractStates, type GuildMercenary } from '@/entities/Guild';

let idCounter = 0;

function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter.toString()}`;
}

export function makeMercenary(overrides: Partial<Mercenary> = {}): Mercenary {
  return {
    id: nextId('merc'),
    name: 'Test Mercenary',
    age: 30,
    gender: Genders.MALE,
    background: 'background',
    species: Species.HUMAN,
    class: Classes.FIGHTER,
    level: 1,
    alignment: Alignments.TRUE_NEUTRAL,
    salary: 10,
    price: 20,
    ...overrides
  };
}

export function makeGuildMercenary(overrides: Partial<GuildMercenary> = {}): GuildMercenary {
  return {
    ...makeMercenary(),
    daysInGuild: 0,
    debt: 0,
    debtDays: 0,
    moral: 100,
    ...overrides
  };
}

export function makeGuildContract(overrides: Partial<GuildContract> = {}): GuildContract {
  return {
    id: nextId('contract'),
    title: 'Test Contract',
    description: 'description',
    customer: 'customer',
    reward: { money: 100, items: [] },
    prepayment: 10,
    difficulty: 1,
    duration: [3, 3],
    availableOnBoardDuring: 5,
    isUrgent: false,
    daysToStart: 5,
    state: GuildContractStates.PENDING,
    mercenaries: [],
    power: 100,
    daysAfterTaken: 0,
    daysInProgress: 0,
    actualDurationDays: null,
    ...overrides
  };
}
