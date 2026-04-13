export interface BaseModalProps {
  modelValue: boolean;
  width?: string;
  height?: string;
  maxHeight?: string;
}
export type BaseModalEmits = (e: 'update:modelValue', modelValue: boolean) => void;
