import { useGameStore } from '@/entities/Game';
import { router } from '@/app/providers';
import { ROUTE_PATH } from '@/shared/config';

export function useTryLoadLastGame() {
  const gameStore = useGameStore();

  if (!gameStore.isGameLoaded) {
    gameStore.loadSavedGames();

    if (gameStore.savedGamesIds.length) {
      gameStore.initLastSavedGame();
    } else {
      router.push(ROUTE_PATH.MENU);
    }
  }
}
