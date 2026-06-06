import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { buildBoardContract, useContractsBoardStore } from '@/entities/ContractsBoard';
import { contractService } from '@/entities/Contract';
import { useHiringMarketStore } from '@/entities/HiringMarket';
import { useGuildStore } from '@/entities/Guild';
import { useLogStore } from '@/entities/Log';
import { mercenaryService } from '@/entities/Mercenary';
import { getChanceWithPity, getRandomInt } from '@/shared/lib/random';
import { v4 as uuidv4 } from 'uuid';
import type { CurrentGame, SavedGame } from '@/entities/Game/model/Game.types.ts';
import {
  loadSavedGamesFromStorage,
  persistSavedGame
} from '@/entities/Game/lib/saveGameStorage.ts';

function getInitialCurrentGameState(): CurrentGame {
  return {
    day: 0,
    daysWithoutNewMercenaries: 0,
    daysWithoutNewContracts: 0
  };
}

export const useGameStore = defineStore('game', () => {
  const savedGames = ref<Record<string, SavedGame>>({});
  const isGameLoaded = ref(false);
  const gameId = ref<string | null>(null);
  const currentGame = ref<CurrentGame>(getInitialCurrentGameState());

  const savedGamesIds = computed(() => Object.keys(savedGames.value));

  function setGameId(id: string | null) {
    gameId.value = id;
  }

  function resetGame(): void {
    isGameLoaded.value = false;
    gameId.value = null;
    currentGame.value = getInitialCurrentGameState();
  }

  function startNewGame({ guildTitle }: { guildTitle: string }): void {
    const guildStore = useGuildStore();
    const contractsBoardStore = useContractsBoardStore();
    const hiringMarketStore = useHiringMarketStore();
    const logStore = useLogStore();

    setGameId(uuidv4());
    currentGame.value = getInitialCurrentGameState();
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

    isGameLoaded.value = true;
  }

  function saveGame(): void {
    if (!gameId.value) {
      return;
    }

    const guildStore = useGuildStore();
    const contractsBoardStore = useContractsBoardStore();
    const hiringMarketStore = useHiringMarketStore();
    const logStore = useLogStore();

    persistSavedGame(gameId.value, {
      guild: guildStore.$state,
      contractsBoard: contractsBoardStore.$state,
      hiringMarket: hiringMarketStore.$state,
      updatedAt: Date.now(),
      game: currentGame.value,
      log: logStore.log
    });
  }

  function loadSavedGames(): void {
    savedGames.value = loadSavedGamesFromStorage();
  }

  function initSavedGame(id: string) {
    const guildStore = useGuildStore();
    const contractsBoardStore = useContractsBoardStore();
    const hiringMarketStore = useHiringMarketStore();
    const logStore = useLogStore();

    const gameToInit = savedGames.value[id];

    setGameId(id);
    currentGame.value = { ...gameToInit.game };
    guildStore.initGuild(gameToInit.guild);
    contractsBoardStore.initContracts(gameToInit.contractsBoard.contracts);
    hiringMarketStore.initMercenaries(gameToInit.hiringMarket.mercenaries);
    logStore.initLog(gameToInit.log ?? []);

    isGameLoaded.value = true;
  }

  function initLastSavedGame() {
    const sortedSavedGamesByDate = Object.entries(savedGames.value).sort(
      (a, b) => b[1].updatedAt - a[1].updatedAt
    );
    initSavedGame(sortedSavedGamesByDate[0][0]);
  }

  function ensureGameLoaded(): { loaded: boolean } {
    if (isGameLoaded.value) {
      return { loaded: true };
    }

    loadSavedGames();

    if (savedGamesIds.value.length) {
      initLastSavedGame();
      return { loaded: true };
    }

    return { loaded: false };
  }

  function addNewMercenariesToMarket(gameDay: number) {
    if (getChanceWithPity(0.33, currentGame.value.daysWithoutNewMercenaries)) {
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
  }

  function addNewContractsToBoard(gameDay: number) {
    if (getChanceWithPity(0.33, currentGame.value.daysWithoutNewContracts)) {
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

  function finishDay() {
    const guildStore = useGuildStore();

    currentGame.value.day += 1;
    const gameDay = currentGame.value.day;

    addNewMercenariesToMarket(gameDay);
    addNewContractsToBoard(gameDay);
    guildStore.paySalary();
    guildStore.applyDebtMoralePerDay(gameDay);
    guildStore.increaseContractsDays(gameDay);
    guildStore.processMercenariesWhoLeaveAtZeroMorale(gameDay);
  }

  return {
    savedGames,
    isGameLoaded,
    gameId,
    currentGame,
    savedGamesIds,
    setGameId,
    resetGame,
    startNewGame,
    saveGame,
    loadSavedGames,
    initSavedGame,
    initLastSavedGame,
    ensureGameLoaded,
    addNewMercenariesToMarket,
    addNewContractsToBoard,
    finishDay
  };
});
