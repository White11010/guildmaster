import { readJson, writeJson } from '@/shared/lib/storage';
import type { SavedGame } from '@/entities/Game/model/Game.types.ts';

const SAVE_STORAGE_KEY = 'guildmaster-saves';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSavedGame(value: unknown): value is SavedGame {
  if (!isRecord(value)) {
    return false;
  }

  if (!isRecord(value.guild)) {
    return false;
  }

  if (!isRecord(value.contractsBoard) || !Array.isArray(value.contractsBoard.contracts)) {
    return false;
  }

  if (!isRecord(value.hiringMarket) || !Array.isArray(value.hiringMarket.mercenaries)) {
    return false;
  }

  if (typeof value.updatedAt !== 'number') {
    return false;
  }

  if (!isRecord(value.game)) {
    return false;
  }

  if (
    typeof value.game.day !== 'number' ||
    typeof value.game.daysWithoutNewMercenaries !== 'number' ||
    typeof value.game.daysWithoutNewContracts !== 'number'
  ) {
    return false;
  }

  if (value.log !== undefined && !Array.isArray(value.log)) {
    return false;
  }

  return true;
}

function parseSavedGames(raw: string | null): Record<string, SavedGame> {
  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed)) {
      return {};
    }

    const result: Record<string, SavedGame> = {};

    for (const [gameId, game] of Object.entries(parsed)) {
      if (isSavedGame(game)) {
        result[gameId] = game;
      }
    }

    return result;
  } catch {
    return {};
  }
}

export function loadSavedGamesFromStorage(): Record<string, SavedGame> {
  return parseSavedGames(readJson(SAVE_STORAGE_KEY));
}

export function persistSavedGame(gameId: string, savedGame: SavedGame): boolean {
  const savedGames = loadSavedGamesFromStorage();
  return writeJson(SAVE_STORAGE_KEY, {
    ...savedGames,
    [gameId]: savedGame
  });
}
