import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useGameStore } from '@/entities/Game';
import { useGuildStore } from '@/entities/Guild';
import { useLogStore } from '@/entities/Log';

vi.mock('@/shared/lib/random', () => ({
  chance: () => false,
  getRandomInt: (min: number) => min,
  getChanceWithPity: () => false,
  getRandomItems: () => []
}));

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});

describe('Game store — new game', () => {
  it('starts a new game with a fresh id and loaded flag', () => {
    const game = useGameStore();
    game.startNewGame({ guildTitle: 'Iron Wolves' });

    expect(game.isGameLoaded).toBe(true);
    expect(game.gameId).not.toBeNull();
    expect(useGuildStore().title).toBe('Iron Wolves');
    expect(game.currentGame.day).toBe(0);
  });

  it('resets game state', () => {
    const game = useGameStore();
    game.startNewGame({ guildTitle: 'Iron Wolves' });
    game.resetGame();

    expect(game.isGameLoaded).toBe(false);
    expect(game.gameId).toBeNull();
    expect(game.currentGame.day).toBe(0);
  });
});

describe('Game store — save/load round-trip', () => {
  it('persists the game and restores it into a fresh pinia instance', () => {
    const game = useGameStore();
    game.startNewGame({ guildTitle: 'Iron Wolves' });
    const guild = useGuildStore();
    guild.addMoney(250);
    game.currentGame.day = 5;
    const savedId = game.gameId;

    game.saveGame();

    setActivePinia(createPinia());
    const reloadedGame = useGameStore();
    reloadedGame.loadSavedGames();
    reloadedGame.initLastSavedGame();

    expect(reloadedGame.gameId).toBe(savedId);
    expect(reloadedGame.currentGame.day).toBe(5);
    expect(useGuildStore().title).toBe('Iron Wolves');
    expect(useGuildStore().money).toBe(350);
  });
});

describe('Game store — initLastSavedGame', () => {
  it('loads the most recently updated save, not the oldest', () => {
    const olderUpdatedAt = 1_000;
    const newerUpdatedAt = 2_000;
    const baseSave = {
      guild: {
        title: '',
        money: 0,
        fame: 0,
        reputation: 0,
        mercenaries: [],
        currentContracts: []
      },
      contractsBoard: { contracts: [] },
      hiringMarket: { mercenaries: [] },
      game: { day: 0, daysWithoutNewMercenaries: 0, daysWithoutNewContracts: 0 },
      log: []
    };

    localStorage.setItem(
      'guildmaster-saves',
      JSON.stringify({
        'old-game': {
          ...baseSave,
          guild: { ...baseSave.guild, title: 'Old Guild' },
          updatedAt: olderUpdatedAt
        },
        'new-game': {
          ...baseSave,
          guild: { ...baseSave.guild, title: 'New Guild' },
          updatedAt: newerUpdatedAt
        }
      })
    );

    const game = useGameStore();
    game.loadSavedGames();
    game.initLastSavedGame();

    expect(game.gameId).toBe('new-game');
    expect(useGuildStore().title).toBe('New Guild');
  });
});

describe('Game store — ensureGameLoaded', () => {
  it('returns loaded:false when there are no saves', () => {
    const game = useGameStore();
    expect(game.ensureGameLoaded()).toEqual({ loaded: false });
  });

  it('returns loaded:true and loads the latest save when one exists', () => {
    const seed = useGameStore();
    seed.startNewGame({ guildTitle: 'Persisted Guild' });
    seed.saveGame();

    setActivePinia(createPinia());
    const game = useGameStore();
    expect(game.ensureGameLoaded()).toEqual({ loaded: true });
    expect(useGuildStore().title).toBe('Persisted Guild');
  });
});

describe('Game store — finishDay', () => {
  it('advances the day and ages mercenaries', () => {
    const game = useGameStore();
    game.startNewGame({ guildTitle: 'Iron Wolves' });
    const guild = useGuildStore();
    guild.initGuild({
      title: 'Iron Wolves',
      money: 100,
      fame: 0,
      reputation: 0,
      mercenaries: [
        {
          id: 'm1',
          name: 'Merc',
          age: 30,
          gender: 0,
          background: 'bg',
          species: 0,
          class: 0,
          level: 1,
          alignment: 0,
          salary: 10,
          price: 20,
          daysInGuild: 0,
          debt: 0,
          debtDays: 0,
          moral: 100
        }
      ],
      currentContracts: []
    });

    game.finishDay();

    expect(game.currentGame.day).toBe(1);
    expect(guild.mercenaries[0].daysInGuild).toBe(1);
    expect(useLogStore().log).toBeDefined();
  });
});
