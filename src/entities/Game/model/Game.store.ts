import { defineStore } from "pinia";
import { type ContractsBoard, useContractsBoardStore } from "@/entities/ContractsBoard";
import { type HiringMarket, useHiringMarketStore } from "@/entities/HiringMarket";
import { type Guild, useGuildStore } from "@/entities/Guild";
import { contracts } from "@/mocks/contracts.ts";
import { getRandomItems } from "@/shared/lib/random";
import { buildBoardContract } from "@/entities/ContractsBoard/model/BoardContract.builder.ts";
import { mercenaries } from "@/mocks/mercanaries.ts";

interface State {
    savedGames: Record<string, SavedGame>;
    isGameLoaded: boolean;
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
            isGameLoaded: false
        };
    },
    actions: {
        startNewGame ({ guildTitle }: { guildTitle: string }) {
            const guildStore = useGuildStore();
            const contractsBoardStore = useContractsBoardStore();
            const hiringMarketStore = useHiringMarketStore();

            guildStore.initGuild({ title: guildTitle, money: 100, fame: 0, reputation: 0 });
            contractsBoardStore.pushNewMultipleContracts(getRandomItems(contracts.map(buildBoardContract), 4));
            hiringMarketStore.pushNewMultipleMercenaries(getRandomItems(mercenaries, 5));

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

        }
    }
});