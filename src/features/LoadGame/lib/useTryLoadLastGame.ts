import { useGameStore } from '@/entities/Game';
import { useRouter } from 'vue-router';
import { ROUTE_PATH } from '@/shared/config';

export function useTryLoadLastGame() {
  const gameStore = useGameStore();
  const router = useRouter();

  const { loaded } = gameStore.ensureGameLoaded();

  if (!loaded) {
    router.push(ROUTE_PATH.MENU);
  }
}
