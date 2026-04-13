export interface SettingsItem {
  title: string;
  type: SettingsItemTypes;
  handler: () => void;
}
export enum SettingsItemTypes {
  CHECKBOX = 'CHECKBOX'
}
