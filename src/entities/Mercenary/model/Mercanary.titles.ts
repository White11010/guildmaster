import { Classes, Species } from '@/entities/Mercenary';

export const SpeciesTitles: Record<Species, string> = {
  [Species.HUMAN]: 'Человек',
  [Species.DWARF]: 'Дварф',
  [Species.ELF]: 'Эльф'
};

export const ClassesTitles: Record<Classes, string> = {
  [Classes.FIGHTER]: 'Воин',
  [Classes.ROGUE]: 'Плут',
  [Classes.RANGER]: 'Следопыт',
  [Classes.WIZARD]: 'Волшебник',
  [Classes.BARBARIAN]: 'Варвар'
};
