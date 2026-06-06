import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Mercenary } from '@/entities/Mercenary';
import {
  type GuildContract,
  GuildContractStates,
  type GuildMercenary
} from '@/entities/Guild/model/Guild.types.ts';
import { useHiringMarketStore } from '@/entities/HiringMarket';
import { useContractsBoardStore } from '@/entities/ContractsBoard';
import {
  buildGuildMercenary,
  normalizeGuildMercenary
} from '@/entities/Guild/model/GuildMercenary.builder.ts';
import {
  CONTRACT_MIN_SQUAD_POWER_RATIO_TO_START,
  MORAL_DECREASE_ALL_MERCS_ON_CONTRACT_OVERDUE,
  MORAL_DECREASE_FOR_CONTRACT_FAILURE
} from '@/entities/Guild/config/GuildContract.config.ts';
import type { ForecastDayCard } from '@/entities/Guild/model/GuildForecast.types.ts';
import {
  MORAL_DECREASE_FOR_DEBT_DAY,
  MORAL_DECREASE_FOR_MERCENARY_DEBT_LEAVE,
  MORAL_INCREASE_FOR_CONTRACT_COMPLETION
} from '@/entities/Guild/config/GuildMercenary.config.ts';
import { getContractSuccessChance } from '@/entities/Guild/lib/getContractSuccessChance.ts';
import { getGuildMercenaryContractPower } from '@/entities/Guild/lib/getGuildMercenaryContractPower.ts';
import { clampGuildMercenaryMoral } from '@/entities/Guild/lib/guildMercenaryMoral.ts';
import { useLogStore } from '@/entities/Log';
import { normalizeGuildContract } from '@/entities/Guild/model/GuildContract.normalize.ts';
import { chance, getRandomInt } from '@/shared/lib/random';

interface State {
  title: string;
  money: number;
  fame: number;
  reputation: number;
  mercenaries: GuildMercenary[];
  currentContracts: GuildContract[];
}

interface ContractResolutionContext {
  gameDay: number;
  contract: GuildContract;
  guildMercenaries: GuildMercenary[];
  addMoney: (amount: number) => void;
}

function addMoraleChangeLog(
  mercenary: GuildMercenary,
  moraleDelta: number,
  reason: string,
  day: number,
  intendedMoraleIncrease?: number
): void {
  const logStore = useLogStore();
  const beforeMoral = mercenary.moral;
  mercenary.moral = clampGuildMercenaryMoral(mercenary.moral + moraleDelta);
  logStore.addMercenaryMoraleChange({
    mercenaryName: mercenary.name,
    beforeMoral,
    afterMoral: mercenary.moral,
    reason,
    day,
    intendedMoraleIncrease
  });
}

function getMercenariesSquadPower(mercenaries: GuildMercenary[]): number {
  return mercenaries.reduce((sum, mercenary) => sum + getGuildMercenaryContractPower(mercenary), 0);
}

function getContractSquadPower(contract: GuildContract, mercenaries: GuildMercenary[]): number {
  return contract.mercenaries.reduce((sum, mercenary) => {
    const guildMercenary = mercenaries.find((gm) => gm.id === mercenary.id);
    return sum + (guildMercenary ? getGuildMercenaryContractPower(guildMercenary) : 0);
  }, 0);
}

function getSalaryDueAmount(mercenary: GuildMercenary, dayOffset: number): number {
  return (mercenary.daysInGuild + dayOffset) % 7 === 0 ? mercenary.salary : 0;
}

function buildForecastDayLabel(dayOffset: number): string {
  if (dayOffset === 1) {
    return 'Завтра';
  }

  if (dayOffset === 2) {
    return 'Послезавтра';
  }

  return `Через ${dayOffset} дн.`;
}

function getProjectedContractIncome(
  contract: GuildContract,
  mercenaries: GuildMercenary[],
  forecastDays: number
): { dayOffset: number; income: number } | null {
  if (contract.state !== GuildContractStates.IN_PROGRESS) {
    return null;
  }

  const durationNeeded = contract.actualDurationDays ?? contract.duration[0];
  const dayOffset = durationNeeded - contract.daysInProgress;

  if (dayOffset < 1 || dayOffset > forecastDays) {
    return null;
  }

  const squadPower = getContractSquadPower(contract, mercenaries);

  return {
    dayOffset,
    income: Math.round(contract.reward.money * getContractSuccessChance(squadPower, contract.power))
  };
}

function buildGreedyDebtSelection(
  mercenaries: GuildMercenary[],
  availableGold: number
): Set<string> {
  const sorted = [...mercenaries].sort((a, b) => a.debt - b.debt);
  const ids = new Set<string>();
  let sum = 0;

  for (const mercenary of sorted) {
    if (sum + mercenary.debt <= availableGold) {
      ids.add(mercenary.id);
      sum += mercenary.debt;
    }
  }

  return ids;
}

function resolveInProgressContract(context: ContractResolutionContext): void {
  const { contract, gameDay, guildMercenaries, addMoney } = context;
  const logStore = useLogStore();
  const squadPower = getContractSquadPower(contract, guildMercenaries);
  const successChance = getContractSuccessChance(squadPower, contract.power);

  if (chance(successChance)) {
    contract.state = GuildContractStates.COMPLETED;
    addMoney(contract.reward.money);
    contract.mercenaries.forEach((mercenary) => {
      const guildMercenary = guildMercenaries.find((gm) => gm.id === mercenary.id);
      if (!guildMercenary) {
        return;
      }
      addMoraleChangeLog(
        guildMercenary,
        MORAL_INCREASE_FOR_CONTRACT_COMPLETION,
        `успешное выполнение контракта «${contract.title}»`,
        gameDay,
        MORAL_INCREASE_FOR_CONTRACT_COMPLETION
      );
    });
    logStore.addContractCompleted(contract.title, gameDay);
    return;
  }

  contract.state = GuildContractStates.FAILED;
  contract.mercenaries.forEach((mercenary) => {
    const guildMercenary = guildMercenaries.find((gm) => gm.id === mercenary.id);
    if (!guildMercenary) {
      return;
    }
    addMoraleChangeLog(
      guildMercenary,
      -MORAL_DECREASE_FOR_CONTRACT_FAILURE,
      `провал контракта «${contract.title}»`,
      gameDay
    );
  });
  logStore.addContractFailed(contract.title, gameDay);
}

function processPendingContractOverdue(
  contract: GuildContract,
  mercenaries: GuildMercenary[],
  gameDay: number
): void {
  if (contract.state !== GuildContractStates.PENDING) {
    return;
  }

  if (contract.daysAfterTaken < contract.daysToStart) {
    return;
  }

  const logStore = useLogStore();
  contract.state = GuildContractStates.OVERDUE;

  mercenaries.forEach((mercenary) => {
    addMoraleChangeLog(
      mercenary,
      -MORAL_DECREASE_ALL_MERCS_ON_CONTRACT_OVERDUE,
      `просрочка контракта «${contract.title}»`,
      gameDay
    );
  });
  logStore.addContractOverdue(contract.title, gameDay);
}

export const useGuildStore = defineStore('guild', () => {
  const title = ref('');
  const money = ref(0);
  const fame = ref(0);
  const reputation = ref(0);
  const mercenaries = ref<GuildMercenary[]>([]);
  const currentContracts = ref<GuildContract[]>([]);

  const guildMercenariesIds = computed(() => mercenaries.value.map((mercenary) => mercenary.id));
  const guildContractsIds = computed(() => currentContracts.value.map((contract) => contract.id));
  const freeMercenaries = computed(() => {
    const contractsInProgress = currentContracts.value.filter(
      (contract) => contract.state === GuildContractStates.IN_PROGRESS
    );
    const busyMercenariesIds = contractsInProgress.reduce<string[]>((acc, contract) => {
      return [...acc, ...contract.mercenaries.map((mercenary) => mercenary.id)];
    }, []);
    return mercenaries.value.filter((mercenary) => !busyMercenariesIds.includes(mercenary.id));
  });
  const mercenariesWithDebt = computed(() =>
    mercenaries.value.filter((mercenary) => mercenary.debt > 0)
  );
  const canSettleAnyDebt = computed((): boolean => {
    if (money.value <= 0) {
      return false;
    }

    return mercenariesWithDebt.value.some((mercenary) => mercenary.debt <= money.value);
  });
  const completedContractsCount = computed(
    () =>
      currentContracts.value.filter((contract) => contract.state === GuildContractStates.COMPLETED)
        .length
  );
  const failedContractsCount = computed(
    () =>
      currentContracts.value.filter((contract) =>
        [GuildContractStates.FAILED, GuildContractStates.OVERDUE].includes(contract.state)
      ).length
  );

  function addMoney(amount: number) {
    money.value += amount;
  }

  function removeMoney(amount: number) {
    money.value -= amount;
  }

  function addReputation(amount: number) {
    reputation.value += amount;
  }

  function removeReputation(amount: number) {
    reputation.value -= amount;
  }

  function addFame(amount: number) {
    fame.value += amount;
  }

  function removeFame(amount: number) {
    fame.value -= amount;
  }

  function initGuild(guild: State) {
    title.value = guild.title;
    money.value = guild.money;
    reputation.value = guild.reputation;
    fame.value = guild.fame;
    mercenaries.value = guild.mercenaries.map(normalizeGuildMercenary);
    currentContracts.value = guild.currentContracts.map(normalizeGuildContract);
  }

  function hireMercenary(mercenary: Mercenary) {
    const hiringMarketStore = useHiringMarketStore();
    if (money.value >= mercenary.price) {
      mercenaries.value.push(buildGuildMercenary(mercenary));
      money.value -= mercenary.price;
      hiringMarketStore.removeMercenaryById(mercenary.id);
    }
  }

  function updateMercenary(updatedMercenary: Mercenary) {
    const mercenaryToUpdate = mercenaries.value.find(
      (mercenary) => mercenary.id === updatedMercenary.id
    );
    if (mercenaryToUpdate) {
      Object.assign(mercenaryToUpdate, updatedMercenary);
    }
  }

  function removeMercenary(mercenaryToRemove: Mercenary) {
    mercenaries.value = mercenaries.value.filter(
      (mercenary) => mercenaryToRemove.id !== mercenary.id
    );
    currentContracts.value.forEach((contract) => {
      if (contract.state === GuildContractStates.IN_PROGRESS) {
        contract.mercenaries = contract.mercenaries.filter((m) => m.id !== mercenaryToRemove.id);
      }
    });
  }

  function processMercenariesWhoLeaveAtZeroMorale(gameDay: number) {
    const logStore = useLogStore();

    // 1. собираем всех, кто должен уйти, за один проход
    const leavers = mercenaries.value.filter((m) => m.moral <= 0);

    if (leavers.length === 0) {
      return;
    }

    // 2. удаляем всех ушедших сразу
    const leaverNames = new Set(leavers.map((m) => m.name));
    leavers.forEach((m) => {
      removeMercenary(m);
    });

    // 3. пересчитываем мораль оставшихся
    for (const m of mercenaries.value) {
      const beforeMoral = m.moral;

      m.moral = clampGuildMercenaryMoral(m.moral - MORAL_DECREASE_FOR_MERCENARY_DEBT_LEAVE);

      logStore.addMercenaryMoraleChange({
        mercenaryName: m.name,
        beforeMoral,
        afterMoral: m.moral,
        reason: 'уход коллеги из-за нулевой морали',
        day: gameDay
      });
    }

    // 4. логируем уход отдельно
    for (const name of leaverNames) {
      logStore.addMercenaryLeftGuild(name, gameDay);
    }
  }

  function addContract(contract: GuildContract) {
    const contractsBoardStore = useContractsBoardStore();

    currentContracts.value.push(contract);

    contractsBoardStore.removeContractById(contract.id);

    addMoney(contract.prepayment);
  }

  function startContract(contract: GuildContract, contractMercenaries: GuildMercenary[]) {
    const contractToStart = currentContracts.value.find(
      (currentContract) => currentContract.id === contract.id
    );
    if (contractToStart) {
      contractToStart.mercenaries = contractMercenaries;
      contractToStart.state = GuildContractStates.IN_PROGRESS;
      contractToStart.daysInProgress = 0;
      contractToStart.actualDurationDays = getRandomInt(
        contractToStart.duration[0],
        contractToStart.duration[1]
      );
    }
  }

  function updateContract(updatedContract: GuildContract) {
    const contractToUpdate = currentContracts.value.find(
      (contract) => contract.id === updatedContract.id
    );
    if (contractToUpdate) {
      Object.assign(contractToUpdate, updatedContract);
    }
  }

  function paySalary() {
    mercenaries.value.forEach((mercenary: GuildMercenary) => {
      mercenary.daysInGuild += 1;

      if (mercenary.daysInGuild % 7 === 0) {
        if (money.value >= mercenary.salary) {
          money.value -= mercenary.salary;
        } else {
          mercenary.debt = mercenary.salary - money.value;
          money.value = 0;
        }
      }
    });
  }

  function applyDebtMoralePerDay(gameDay: number) {
    const logStore = useLogStore();
    mercenaries.value.forEach((mercenary: GuildMercenary) => {
      if (mercenary.debt > 0) {
        mercenary.debtDays += 1;
        const beforeMoral = mercenary.moral;
        mercenary.moral = clampGuildMercenaryMoral(mercenary.moral - MORAL_DECREASE_FOR_DEBT_DAY);
        logStore.addMercenaryMoraleChange({
          mercenaryName: mercenary.name,
          beforeMoral,
          afterMoral: mercenary.moral,
          reason: 'долг по зарплате',
          day: gameDay
        });
      }
    });
  }

  function payMercenaryDebt(mercenaryId: string) {
    const mercenary = mercenaries.value.find((m) => m.id === mercenaryId);
    if (!mercenary || mercenary.debt <= 0 || money.value < mercenary.debt) {
      return;
    }
    money.value -= mercenary.debt;
    mercenary.debt = 0;
    mercenary.debtDays = 0;
  }

  function getMercenaryContractPower(mercenary: GuildMercenary): number {
    return getGuildMercenaryContractPower(mercenary);
  }

  function getContractStartPreview(contract: GuildContract, squadMercenaries: GuildMercenary[]) {
    const squadPower = getMercenariesSquadPower(squadMercenaries);
    const minSquadPower = Math.ceil(contract.power * CONTRACT_MIN_SQUAD_POWER_RATIO_TO_START);
    const canStart = squadPower >= minSquadPower;
    const successChancePercent = canStart
      ? Math.round(getContractSuccessChance(squadPower, contract.power) * 1000) / 10
      : null;

    return {
      squadPower,
      minSquadPower,
      minSquadPowerRatioPercent: Math.round(CONTRACT_MIN_SQUAD_POWER_RATIO_TO_START * 100),
      canStart,
      successChancePercent
    };
  }

  function getGreedyDebtSelection(availableGold?: number): Set<string> {
    return buildGreedyDebtSelection(mercenariesWithDebt.value, availableGold ?? money.value);
  }

  function paySelectedMercenaryDebts(mercenaryIds: string[]): void {
    const ordered = mercenariesWithDebt.value
      .filter((mercenary) => mercenaryIds.includes(mercenary.id))
      .sort((a, b) => a.debt - b.debt);

    for (const mercenary of ordered) {
      payMercenaryDebt(mercenary.id);
    }
  }

  function getCashflowForecast(currentGameDay: number, forecastDays = 7): ForecastDayCard[] {
    const contractIncomeByDay = new Map<number, number>();
    const contractEventsByDay = new Map<number, number>();

    currentContracts.value
      .map((contract) => getProjectedContractIncome(contract, mercenaries.value, forecastDays))
      .filter(
        (projection): projection is { dayOffset: number; income: number } => projection !== null
      )
      .forEach((projection) => {
        contractIncomeByDay.set(
          projection.dayOffset,
          (contractIncomeByDay.get(projection.dayOffset) ?? 0) + projection.income
        );
        contractEventsByDay.set(
          projection.dayOffset,
          (contractEventsByDay.get(projection.dayOffset) ?? 0) + 1
        );
      });

    let previousEndGold = money.value;

    return Array.from({ length: forecastDays }, (_, index) => {
      const dayOffset = index + 1;
      const startGold = previousEndGold;
      const plannedSalary = mercenaries.value.reduce((sum, mercenary) => {
        return sum + getSalaryDueAmount(mercenary, dayOffset);
      }, 0);
      const expenses = Math.min(startGold, plannedSalary);
      const income = contractIncomeByDay.get(dayOffset) ?? 0;
      const endGold = startGold - expenses + income;
      const delta = endGold - startGold;
      const salaryEvents = mercenaries.value.filter(
        (mercenary) => getSalaryDueAmount(mercenary, dayOffset) > 0
      ).length;

      previousEndGold = endGold;

      return {
        dayLabel: buildForecastDayLabel(dayOffset),
        dayNumber: currentGameDay + dayOffset,
        startGold,
        endGold,
        income,
        expenses,
        delta,
        salaryEvents,
        contractEvents: contractEventsByDay.get(dayOffset) ?? 0
      };
    });
  }

  function increaseContractsDays(gameDay: number): void {
    currentContracts.value.forEach((contract: GuildContract) => {
      contract.daysAfterTaken += 1;

      if (contract.state === GuildContractStates.IN_PROGRESS) {
        contract.daysInProgress += 1;
        const durationNeeded = contract.actualDurationDays ?? contract.duration[0];
        if (contract.daysInProgress >= durationNeeded) {
          resolveInProgressContract({
            gameDay,
            contract,
            guildMercenaries: mercenaries.value,
            addMoney: (amount: number) => {
              addMoney(amount);
            }
          });
        }
      }

      processPendingContractOverdue(contract, mercenaries.value, gameDay);
    });
  }

  return {
    title,
    money,
    fame,
    reputation,
    mercenaries,
    currentContracts,
    guildMercenariesIds,
    guildContractsIds,
    freeMercenaries,
    mercenariesWithDebt,
    canSettleAnyDebt,
    completedContractsCount,
    failedContractsCount,
    initGuild,
    hireMercenary,
    updateMercenary,
    removeMercenary,
    processMercenariesWhoLeaveAtZeroMorale,
    addContract,
    startContract,
    updateContract,
    addMoney,
    removeMoney,
    addReputation,
    removeReputation,
    addFame,
    removeFame,
    paySalary,
    applyDebtMoralePerDay,
    payMercenaryDebt,
    getMercenaryContractPower,
    getContractStartPreview,
    getGreedyDebtSelection,
    paySelectedMercenaryDebts,
    getCashflowForecast,
    increaseContractsDays
  };
});
