import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useGuildStore } from '@/entities/Guild';
import { GuildContractStates } from '@/entities/Guild';
import { makeGuildContract, makeGuildMercenary } from '@/shared/testing/fixtures.ts';

const chanceMock = vi.fn<(probability: number) => boolean>();
const getRandomIntMock = vi.fn<(min: number, max: number) => number>();

vi.mock('@/shared/lib/random', () => ({
  chance: (probability: number) => chanceMock(probability),
  getRandomInt: (min: number, max: number) => getRandomIntMock(min, max),
  getChanceWithPity: () => false,
  getRandomItems: () => []
}));

beforeEach(() => {
  setActivePinia(createPinia());
  chanceMock.mockReset();
  getRandomIntMock.mockReset();
  getRandomIntMock.mockImplementation((min) => min);
});

describe('Guild store — money', () => {
  it('adds and removes money through actions only', () => {
    const guild = useGuildStore();
    guild.addMoney(100);
    expect(guild.money).toBe(100);
    guild.removeMoney(40);
    expect(guild.money).toBe(60);
  });
});

describe('Guild store — salary & debt', () => {
  it('creates debt when there is not enough money on payday (day 7)', () => {
    const guild = useGuildStore();
    guild.initGuild({
      title: 'G',
      money: 4,
      fame: 0,
      reputation: 0,
      mercenaries: [makeGuildMercenary({ salary: 10, daysInGuild: 6 })],
      currentContracts: []
    });

    guild.paySalary();

    const merc = guild.mercenaries[0];
    expect(merc.daysInGuild).toBe(7);
    expect(guild.money).toBe(0);
    expect(merc.debt).toBe(6);
  });

  it('pays full salary when affordable and leaves no debt', () => {
    const guild = useGuildStore();
    guild.initGuild({
      title: 'G',
      money: 100,
      fame: 0,
      reputation: 0,
      mercenaries: [makeGuildMercenary({ salary: 10, daysInGuild: 6 })],
      currentContracts: []
    });

    guild.paySalary();

    expect(guild.money).toBe(90);
    expect(guild.mercenaries[0].debt).toBe(0);
  });

  it('decreases morale per day while a mercenary carries debt', () => {
    const guild = useGuildStore();
    guild.initGuild({
      title: 'G',
      money: 0,
      fame: 0,
      reputation: 0,
      mercenaries: [makeGuildMercenary({ debt: 5, moral: 100 })],
      currentContracts: []
    });

    guild.applyDebtMoralePerDay(1);

    expect(guild.mercenaries[0].moral).toBe(95);
    expect(guild.mercenaries[0].debtDays).toBe(1);
  });

  it('pays a selected debt and resets its counters', () => {
    const guild = useGuildStore();
    guild.initGuild({
      title: 'G',
      money: 100,
      fame: 0,
      reputation: 0,
      mercenaries: [makeGuildMercenary({ debt: 30, debtDays: 4 })],
      currentContracts: []
    });

    const mercId = guild.mercenaries[0].id;
    guild.payMercenaryDebt(mercId);

    expect(guild.money).toBe(70);
    expect(guild.mercenaries[0].debt).toBe(0);
    expect(guild.mercenaries[0].debtDays).toBe(0);
  });
});

describe('Guild store — debt settlement', () => {
  it('canSettleAnyDebt is false with no money', () => {
    const guild = useGuildStore();
    guild.initGuild({
      title: 'G',
      money: 0,
      fame: 0,
      reputation: 0,
      mercenaries: [makeGuildMercenary({ debt: 10 })],
      currentContracts: []
    });

    expect(guild.canSettleAnyDebt).toBe(false);
  });

  it('canSettleAnyDebt is true when at least one debt is affordable', () => {
    const guild = useGuildStore();
    guild.initGuild({
      title: 'G',
      money: 15,
      fame: 0,
      reputation: 0,
      mercenaries: [makeGuildMercenary({ debt: 10 }), makeGuildMercenary({ debt: 100 })],
      currentContracts: []
    });

    expect(guild.canSettleAnyDebt).toBe(true);
  });

  it('greedily selects the cheapest affordable debts first', () => {
    const guild = useGuildStore();
    const cheap = makeGuildMercenary({ debt: 10 });
    const mid = makeGuildMercenary({ debt: 20 });
    const expensive = makeGuildMercenary({ debt: 100 });
    guild.initGuild({
      title: 'G',
      money: 35,
      fame: 0,
      reputation: 0,
      mercenaries: [expensive, cheap, mid],
      currentContracts: []
    });

    const selected = guild.getGreedyDebtSelection();

    expect(selected.has(cheap.id)).toBe(true);
    expect(selected.has(mid.id)).toBe(true);
    expect(selected.has(expensive.id)).toBe(false);
  });
});

describe('Guild store — morale clamping & leavers', () => {
  it('clamps debt morale loss at zero rather than going negative', () => {
    const guild = useGuildStore();
    guild.initGuild({
      title: 'G',
      money: 0,
      fame: 0,
      reputation: 0,
      mercenaries: [makeGuildMercenary({ debt: 5, moral: 2 })],
      currentContracts: []
    });

    guild.applyDebtMoralePerDay(1);

    expect(guild.mercenaries[0].moral).toBe(0);
  });

  it('removes mercenaries at zero morale and lowers morale of those who remain', () => {
    const guild = useGuildStore();
    const leaver = makeGuildMercenary({ moral: 0 });
    const stayer = makeGuildMercenary({ moral: 100 });
    guild.initGuild({
      title: 'G',
      money: 0,
      fame: 0,
      reputation: 0,
      mercenaries: [leaver, stayer],
      currentContracts: []
    });

    guild.processMercenariesWhoLeaveAtZeroMorale(1);

    expect(guild.mercenaries).toHaveLength(1);
    expect(guild.mercenaries[0].id).toBe(stayer.id);
    expect(guild.mercenaries[0].moral).toBe(50);
  });
});

describe('Guild store — contract resolution', () => {
  it('completes an in-progress contract and pays the reward when the roll succeeds', () => {
    chanceMock.mockReturnValue(true);
    const guild = useGuildStore();
    const merc = makeGuildMercenary({ level: 6, moral: 100 });
    const contract = makeGuildContract({
      state: GuildContractStates.IN_PROGRESS,
      power: 100,
      reward: { money: 500, items: [] },
      duration: [3, 3],
      actualDurationDays: 3,
      daysInProgress: 2,
      mercenaries: [merc]
    });
    guild.initGuild({
      title: 'G',
      money: 0,
      fame: 0,
      reputation: 0,
      mercenaries: [merc],
      currentContracts: [contract]
    });

    guild.increaseContractsDays(5);

    expect(guild.currentContracts[0].state).toBe(GuildContractStates.COMPLETED);
    expect(guild.money).toBe(500);
  });

  it('fails an in-progress contract and lowers morale when the roll fails', () => {
    chanceMock.mockReturnValue(false);
    const guild = useGuildStore();
    const merc = makeGuildMercenary({ level: 6, moral: 100 });
    const contract = makeGuildContract({
      state: GuildContractStates.IN_PROGRESS,
      power: 100,
      reward: { money: 500, items: [] },
      duration: [3, 3],
      actualDurationDays: 3,
      daysInProgress: 2,
      mercenaries: [merc]
    });
    guild.initGuild({
      title: 'G',
      money: 0,
      fame: 0,
      reputation: 0,
      mercenaries: [merc],
      currentContracts: [contract]
    });

    guild.increaseContractsDays(5);

    expect(guild.currentContracts[0].state).toBe(GuildContractStates.FAILED);
    expect(guild.money).toBe(0);
    expect(guild.mercenaries[0].moral).toBe(90);
  });

  it('marks a pending contract overdue once its start window passes', () => {
    const guild = useGuildStore();
    const contract = makeGuildContract({
      state: GuildContractStates.PENDING,
      daysToStart: 3,
      daysAfterTaken: 2,
      mercenaries: []
    });
    guild.initGuild({
      title: 'G',
      money: 0,
      fame: 0,
      reputation: 0,
      mercenaries: [makeGuildMercenary({ moral: 100 })],
      currentContracts: [contract]
    });

    guild.increaseContractsDays(5);

    expect(guild.currentContracts[0].state).toBe(GuildContractStates.OVERDUE);
    expect(guild.mercenaries[0].moral).toBe(90);
  });
});
