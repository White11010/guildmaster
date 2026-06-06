import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type LogEvent, LogEventTypes } from '@/entities/Log';
import type { Mercenary } from '@/entities/Mercenary';
import { v4 as uuidv4 } from 'uuid';
import type { BoardContract } from '@/entities/ContractsBoard';
import { GUILD_MERCENARY_MORAL_MAX } from '@/entities/Guild';

export const useLogStore = defineStore('log', () => {
  const log = ref<LogEvent[]>([]);

  function initLog(newLog: LogEvent[]) {
    log.value = newLog;
  }

  function addNewMercenaryEvent(mercenary: Mercenary, day?: number) {
    log.value.unshift({
      id: uuidv4(),
      type: LogEventTypes.NEW_MERCENARY,
      text: `На рынке доступен новый наемник: ${mercenary.name}`,
      day
    });
  }

  function addNewMercenaryEventMultiple(mercenaries: Mercenary[], day?: number) {
    mercenaries.forEach((mercenary: Mercenary) => {
      addNewMercenaryEvent(mercenary, day);
    });
  }

  function addNewContractEvent(contract: BoardContract, day?: number) {
    log.value.unshift({
      id: uuidv4(),
      type: LogEventTypes.NEW_CONTRACT,
      text: `На доске доступен новый контракт: ${contract.title}`,
      day
    });
  }

  function addNewContractEventMultiple(contracts: BoardContract[], day?: number) {
    contracts.forEach((contract: BoardContract) => {
      addNewContractEvent(contract, day);
    });
  }

  function addMercenaryMoraleChange(params: {
    mercenaryName: string;
    reason: string;
    day: number;
    beforeMoral: number;
    afterMoral: number;
    intendedMoraleIncrease?: number;
  }) {
    const { mercenaryName, reason, day, beforeMoral, afterMoral, intendedMoraleIncrease } = params;
    const actual = afterMoral - beforeMoral;
    let text: string;
    if (intendedMoraleIncrease !== undefined && intendedMoraleIncrease > 0) {
      if (actual === 0) {
        text = `${mercenaryName}: мораль не изменилась (уже максимум ${GUILD_MERCENARY_MORAL_MAX}), `;
      } else if (actual < intendedMoraleIncrease) {
        text =
          `${mercenaryName}: мораль +${actual} вместо +${intendedMoraleIncrease} ` +
          `(было ${beforeMoral} до потолка ${GUILD_MERCENARY_MORAL_MAX}) — ${reason}`;
      } else {
        text = `${mercenaryName}: мораль +${actual} — ${reason}`;
      }
    } else {
      const sign = actual > 0 ? '+' : '';
      text = `${mercenaryName}: мораль ${sign}${actual} — ${reason}`;
    }
    log.value.unshift({
      id: uuidv4(),
      type: LogEventTypes.MERCENARY_MORALE,
      text,
      day
    });
  }

  function addMercenaryLeftGuild(mercenaryName: string, day: number) {
    log.value.unshift({
      id: uuidv4(),
      type: LogEventTypes.MERCENARY_LEFT_GUILD,
      text: `${mercenaryName} покинул гильдию (мораль на нуле)`,
      day
    });
  }

  function addContractCompleted(contractTitle: string, day: number) {
    log.value.unshift({
      id: uuidv4(),
      type: LogEventTypes.CONTRACT_COMPLETED,
      text: `Контракт выполнен: «${contractTitle}»`,
      day
    });
  }

  function addContractFailed(contractTitle: string, day: number) {
    log.value.unshift({
      id: uuidv4(),
      type: LogEventTypes.CONTRACT_FAILED,
      text: `Контракт провален: «${contractTitle}»`,
      day
    });
  }

  function addContractOverdue(contractTitle: string, day: number) {
    log.value.unshift({
      id: uuidv4(),
      type: LogEventTypes.CONTRACT_OVERDUE,
      text: `Просрочен контракт: «${contractTitle}»`,
      day
    });
  }

  return {
    log,
    initLog,
    addNewMercenaryEvent,
    addNewMercenaryEventMultiple,
    addNewContractEvent,
    addNewContractEventMultiple,
    addMercenaryMoraleChange,
    addMercenaryLeftGuild,
    addContractCompleted,
    addContractFailed,
    addContractOverdue
  };
});
