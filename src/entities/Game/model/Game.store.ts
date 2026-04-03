import { defineStore } from "pinia";
import { type ContractsBoard, useContractsBoardStore } from "@/entities/ContractsBoard";
import { type HiringMarket, useHiringMarketStore } from "@/entities/HiringMarket";
import { type Guild, useGuildStore } from "@/entities/Guild";
import { getChanceWithPity, getRandomInt } from "@/shared/lib/random";
import { buildBoardContract } from "@/entities/ContractsBoard/model/BoardContract.builder.ts";
import { mercenaryService } from "@/entities/Mercenary/api";
import { useLogStore } from "@/entities/Log";
import { contractService } from "@/entities/Contract/api/Contract.service.ts";

interface State {
    savedGames: Record<string, SavedGame>;
    isGameLoaded: boolean;
    currentGame: {
        day: number;
        daysWithoutNewMercenaries: number;
        daysWithoutNewContracts: number;
    };
}

interface SavedGame {
    guild: Guild;
    contractsBoard: ContractsBoard;
    hiringMarket: HiringMarket;
    updatedAt: number;
}

export const useGameStore = defineStore('game', {
    state: (): State => {
        return {
            savedGames: {},
            isGameLoaded: false,
            currentGame: {
                day: 0,
                daysWithoutNewMercenaries: 0,
                daysWithoutNewContracts: 0
            }
        };
    },
    actions: {
        startNewGame ({ guildTitle }: { guildTitle: string }) {
            const guildStore = useGuildStore();
            const contractsBoardStore = useContractsBoardStore();
            const hiringMarketStore = useHiringMarketStore();

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

            const gameDataToSave = {
                guild: guildStore.$state,
                contractsBoard: contractsBoardStore.$state,
                hiringMarket: hiringMarketStore.$state,
                updatedAt: Date.now()
            };
            const savedGamesRaw = localStorage.getItem('guildmaster-saves');
            const savedGamesData = savedGamesRaw ? JSON.parse(savedGamesRaw) : {};
            const gamesToSave = {
                ...savedGamesData,
                [guildStore.title]: gameDataToSave
            };
            localStorage.setItem('guildmaster-saves', JSON.stringify(gamesToSave));
        },
        loadSavedGames () {
            const savedGamesRaw = localStorage.getItem('guildmaster-saves');
            this.savedGames = savedGamesRaw ? JSON.parse(savedGamesRaw) : {};
        },
        initSavedGame (guildTitle: string) {
            const guildStore = useGuildStore();
            const contractsBoardStore = useContractsBoardStore();
            const hiringMarketStore = useHiringMarketStore();

            const gameToInit = this.savedGames[guildTitle];

            guildStore.initGuild(gameToInit.guild);
            contractsBoardStore.initContracts(gameToInit.contractsBoard.contracts);
            hiringMarketStore.initMercenaries(gameToInit.hiringMarket.mercenaries);

            this.isGameLoaded = true;
        },
        initLastSavedGame () {
            const sortedSavedGamesByDate = Object.values(this.savedGames)
                .sort((a, b) => a.updatedAt - b.updatedAt);
            this.initSavedGame(sortedSavedGamesByDate[0].guild.title);

        },
        finishDay () {
            this.currentGame.day += 1;

            this.addNewMercenariesToMarket();
            this.addNewContractsToBoard();
        },
        addNewMercenariesToMarket () {
            if (getChanceWithPity(0.33, this.currentGame.daysWithoutNewMercenaries)) {
                const hiringMarketStore = useHiringMarketStore();
                const logStore = useLogStore();
                const guildStore = useGuildStore();

                const newMercenaries = mercenaryService.getRandomMercenaries(
                    getRandomInt(1, 2),
                    [...guildStore.guildMercenariesIds, ...hiringMarketStore.mercenariesIds]
                );
                hiringMarketStore.addNewMultipleMercenaries(newMercenaries);
                logStore.pushNewMercenaryEventMultiple(newMercenaries);
            }
        },
        addNewContractsToBoard () {
            if (getChanceWithPity(0.33, this.currentGame.daysWithoutNewContracts)) {
                const contractsBoardStore = useContractsBoardStore();
                const logStore = useLogStore();
                const guildStore = useGuildStore();

                const newContracts = contractService.getRandomContracts(
                    getRandomInt(1, 2),
                    [...guildStore.guildContractsIds, ...contractsBoardStore.contractsIds]
                );
                contractsBoardStore.addNewMultipleContracts(newContracts.map(buildBoardContract));
                logStore.pushNewContractEventMultiple(newContracts.map(buildBoardContract));
            }
        }
    }
});