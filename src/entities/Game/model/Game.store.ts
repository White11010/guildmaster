import { defineStore } from "pinia";
import { type ContractsBoard, useContractsBoardStore } from "@/entities/ContractsBoard";
import { type HiringMarket, useHiringMarketStore } from "@/entities/HiringMarket";
import { type Guild, useGuildStore } from "@/entities/Guild";
import { getChanceWithPity, getRandomInt } from "@/shared/lib/random";
import { buildBoardContract } from "@/entities/ContractsBoard/model/BoardContract.builder.ts";
import { mercenaryService } from "@/entities/Mercenary/api";
import { type LogEvent, useLogStore } from "@/entities/Log";
import { contractService } from "@/entities/Contract/api/Contract.service.ts";
import { v4 as uuidv4 } from "uuid";

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
        day: number,
        daysWithoutNewMercenaries: number,
        daysWithoutNewContracts: number
    };
    log?: Array<LogEvent>;
}

export const useGameStore = defineStore('game', {
    state: (): State => {
        return {
            savedGames: {},
            isGameLoaded: false,
            gameId: null,
            currentGame: {
                day: 0,
                daysWithoutNewMercenaries: 0,
                daysWithoutNewContracts: 0
            }
        };
    },
    getters: {
      savedGamesIds: (state: State): Array<string> => Object.keys(state.savedGames)
    },
    actions: {
        setGameId (gameId: string | null) {
            this.gameId = gameId;
        },
        resetGame () {

        },
        startNewGame ({ guildTitle }: { guildTitle: string }) {
            const guildStore = useGuildStore();
            const contractsBoardStore = useContractsBoardStore();
            const hiringMarketStore = useHiringMarketStore();
            const logStore = useLogStore();

            this.setGameId(uuidv4());
            this.currentGame = {
                day: 0,
                daysWithoutNewMercenaries: 0,
                daysWithoutNewContracts: 0,
            };
            logStore.initLog([]);
            guildStore.initGuild({
                title: guildTitle,
                money: 100,
                fame: 0,
                reputation: 0,
                mercenaries: [],
                currentContracts: []
            });
            contractsBoardStore.addNewMultipleContracts(contractService.getRandomContracts(4, []).map(buildBoardContract));
            hiringMarketStore.addNewMultipleMercenaries(mercenaryService.getRandomMercenaries(5, []));

            this.isGameLoaded = true;
        },
        saveGame () {
            const guildStore = useGuildStore();
            const contractsBoardStore = useContractsBoardStore();
            const hiringMarketStore = useHiringMarketStore();

            const logStore = useLogStore();
            const gameDataToSave = {
                guild: guildStore.$state,
                contractsBoard: contractsBoardStore.$state,
                hiringMarket: hiringMarketStore.$state,
                updatedAt: Date.now(),
                game: this.currentGame,
                log: logStore.log,
            };
            const savedGamesRaw = localStorage.getItem('guildmaster-saves');
            const savedGamesData = savedGamesRaw ? JSON.parse(savedGamesRaw) : {};
            const gamesToSave = {
                ...savedGamesData,
                [this.gameId!]: gameDataToSave
            };
            localStorage.setItem('guildmaster-saves', JSON.stringify(gamesToSave));
        },
        loadSavedGames () {
            const savedGamesRaw = localStorage.getItem('guildmaster-saves');
            this.savedGames = savedGamesRaw ? JSON.parse(savedGamesRaw) : {};
        },
        initSavedGame (gameId: string) {
            const guildStore = useGuildStore();
            const contractsBoardStore = useContractsBoardStore();
            const hiringMarketStore = useHiringMarketStore();
            const logStore = useLogStore();

            const gameToInit = this.savedGames[gameId];

            this.setGameId(gameId);
            this.currentGame = { ...gameToInit.game };
            guildStore.initGuild(gameToInit.guild);
            contractsBoardStore.initContracts(gameToInit.contractsBoard.contracts);
            hiringMarketStore.initMercenaries(gameToInit.hiringMarket.mercenaries);
            logStore.initLog(gameToInit.log ?? []);

            this.isGameLoaded = true;
        },
        initLastSavedGame () {
            const sortedSavedGamesByDate = Object.entries(this.savedGames)
                .sort((a, b) => a[1].updatedAt - b[1].updatedAt);
            this.initSavedGame(sortedSavedGamesByDate[0][0]);

        },
        finishDay () {
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
        addNewMercenariesToMarket (gameDay: number) {
            if (getChanceWithPity(0.33, this.currentGame.daysWithoutNewMercenaries)) {
                const hiringMarketStore = useHiringMarketStore();
                const logStore = useLogStore();
                const guildStore = useGuildStore();

                const newMercenaries = mercenaryService.getRandomMercenaries(
                    getRandomInt(1, 2),
                    [...guildStore.guildMercenariesIds, ...hiringMarketStore.mercenariesIds]
                );
                hiringMarketStore.addNewMultipleMercenaries(newMercenaries);
                logStore.addNewMercenaryEventMultiple(newMercenaries, gameDay);
            }
        },
        addNewContractsToBoard (gameDay: number) {
            if (getChanceWithPity(0.33, this.currentGame.daysWithoutNewContracts)) {
                const contractsBoardStore = useContractsBoardStore();
                const logStore = useLogStore();
                const guildStore = useGuildStore();

                const newContracts = contractService.getRandomContracts(
                    getRandomInt(1, 2),
                    [...guildStore.guildContractsIds, ...contractsBoardStore.contractsIds]
                );
                contractsBoardStore.addNewMultipleContracts(newContracts.map(buildBoardContract));
                logStore.addNewContractEvenMultiple(newContracts.map(buildBoardContract), gameDay);
            }
        }
    }
});