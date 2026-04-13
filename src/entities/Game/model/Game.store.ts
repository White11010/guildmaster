import { defineStore } from 'pinia';
import { type ContractsBoard, useContractsBoardStore } from '@/entities/ContractsBoard';
import { type HiringMarket, useHiringMarketStore } from '@/entities/HiringMarket';
import { type Guild, useGuildStore } from '@/entities/Guild';
import { getChanceWithPity, getRandomInt } from '@/shared/lib/random';
import { buildBoardContract } from '@/entities/ContractsBoard/model/BoardContract.builder.ts';
import { mercenaryService } from '@/entities/Mercenary/api';
import { type LogEvent, useLogStore } from '@/entities/Log';
import { contractService } from '@/entities/Contract/api/Contract.service.ts';
import { v4 as uuidv4 } from 'uuid';

interface State {
  savedGames: Record<string, SavedGame>;
  isGameLoaded: boolean;
  currentGame: {
    day: number;
    daysWithoutNewMercenaries: number;
    daysWithoutNewContracts: number;
  };
  gameId: string | null;
}

interface SavedGame {
  guild: Guild;
  contractsBoard: ContractsBoard;
  hiringMarket: HiringMarket;
  updatedAt: number;
  game: {
    day: number;
    daysWithoutNewMercenaries: number;
    daysWithoutNewContracts: number;
  };
  log?: LogEvent[];
}

interface RuntimeStores {
  guildStore: ReturnType<typeof useGuildStore>;
  contractsBoardStore: ReturnType<typeof useContractsBoardStore>;
  hiringMarketStore: ReturnType<typeof useHiringMarketStore>;
  logStore: ReturnType<typeof useLogStore>;
}

const SAVE_STORAGE_KEY = 'guildmaster-saves';

function getRuntimeStores(): RuntimeStores {
  return {
    guildStore: useGuildStore(),
    contractsBoardStore: useContractsBoardStore(),
    hiringMarketStore: useHiringMarketStore(),
    logStore: useLogStore()
  };
}

function parseSavedGames(raw: string | null): Record<string, SavedGame> {
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as Record<string, SavedGame>;
  } catch {
    return {};
  }
}

function getInitialCurrentGameState(): State['currentGame'] {
  return {
    day: 0,
    daysWithoutNewMercenaries: 0,
    daysWithoutNewContracts: 0
  };
}

export const useGameStore = defineStore('game', {
  state: (): State => {
    return {
      savedGames: {},
      isGameLoaded: false,
      gameId: null,
      currentGame: getInitialCurrentGameState()
    };
  },
  getters: {
    savedGamesIds: (state: State): string[] => Object.keys(state.savedGames)
  },
  actions: {
    setGameId(gameId: string | null) {
      this.gameId = gameId;
    },
    resetGame(): void {
      this.isGameLoaded = false;
      this.gameId = null;
      this.currentGame = getInitialCurrentGameState();
    },
    startNewGame({ guildTitle }: { guildTitle: string }): void {
      const { guildStore, contractsBoardStore, hiringMarketStore, logStore } = getRuntimeStores();

      this.setGameId(uuidv4());
      this.currentGame = getInitialCurrentGameState();
      logStore.initLog([]);
      guildStore.initGuild({
        title: guildTitle,
        money: 100,
        fame: 0,
        reputation: 0,
        mercenaries: [],
        currentContracts: []
      });
      contractsBoardStore.addNewMultipleContracts(
        contractService.getRandomContracts(4, []).map(buildBoardContract)
      );
      hiringMarketStore.addNewMultipleMercenaries(mercenaryService.getRandomMercenaries(5, []));

      this.isGameLoaded = true;
    },
    saveGame(): void {
      if (this.gameId) {
        const { guildStore, contractsBoardStore, hiringMarketStore, logStore } = getRuntimeStores();
        const gameDataToSave = {
          guild: guildStore.$state,
          contractsBoard: contractsBoardStore.$state,
          hiringMarket: hiringMarketStore.$state,
          updatedAt: Date.now(),
          game: this.currentGame,
          log: logStore.log
        };
        const savedGamesData = parseSavedGames(localStorage.getItem(SAVE_STORAGE_KEY));
        const gamesToSave = {
          ...savedGamesData,
          [this.gameId]: gameDataToSave
        };
        localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(gamesToSave));
      }
    },
    loadSavedGames(): void {
      this.savedGames = parseSavedGames(localStorage.getItem(SAVE_STORAGE_KEY));
    },
    initSavedGame(gameId: string) {
      const { guildStore, contractsBoardStore, hiringMarketStore, logStore } = getRuntimeStores();

      const gameToInit = this.savedGames[gameId];

      this.setGameId(gameId);
      this.currentGame = { ...gameToInit.game };
      guildStore.initGuild(gameToInit.guild);
      contractsBoardStore.initContracts(gameToInit.contractsBoard.contracts);
      hiringMarketStore.initMercenaries(gameToInit.hiringMarket.mercenaries);
      logStore.initLog(gameToInit.log ?? []);

      this.isGameLoaded = true;
    },
    initLastSavedGame() {
      const sortedSavedGamesByDate = Object.entries(this.savedGames).sort(
        (a, b) => a[1].updatedAt - b[1].updatedAt
      );
      this.initSavedGame(sortedSavedGamesByDate[0][0]);
    },
    finishDay() {
      const guildStore = useGuildStore();

      this.currentGame.day += 1;
      const gameDay = this.currentGame.day;

      this.addNewMercenariesToMarket(gameDay);
      this.addNewContractsToBoard(gameDay);
      guildStore.paySalary();
      guildStore.applyDebtMoralePerDay(gameDay);
      guildStore.increaseContractsDays(gameDay);
      guildStore.processMercenariesWhoLeaveAtZeroMorale(gameDay);
    },
    addNewMercenariesToMarket(gameDay: number) {
      if (getChanceWithPity(0.33, this.currentGame.daysWithoutNewMercenaries)) {
        const hiringMarketStore = useHiringMarketStore();
        const logStore = useLogStore();
        const guildStore = useGuildStore();

        const newMercenaries = mercenaryService.getRandomMercenaries(getRandomInt(1, 2), [
          ...guildStore.guildMercenariesIds,
          ...hiringMarketStore.mercenariesIds
        ]);
        hiringMarketStore.addNewMultipleMercenaries(newMercenaries);
        logStore.addNewMercenaryEventMultiple(newMercenaries, gameDay);
      }
    },
    addNewContractsToBoard(gameDay: number) {
      if (getChanceWithPity(0.33, this.currentGame.daysWithoutNewContracts)) {
        const contractsBoardStore = useContractsBoardStore();
        const logStore = useLogStore();
        const guildStore = useGuildStore();

        const newContracts = contractService.getRandomContracts(getRandomInt(1, 2), [
          ...guildStore.guildContractsIds,
          ...contractsBoardStore.contractsIds
        ]);
        contractsBoardStore.addNewMultipleContracts(newContracts.map(buildBoardContract));
        logStore.addNewContractEvenMultiple(newContracts.map(buildBoardContract), gameDay);
      }
    }
  }
});
