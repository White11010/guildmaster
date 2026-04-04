export interface BaseModalProps {
    modelValue: boolean;
    width?: string;
    height?: string;
}
export interface BaseModalEmits {
    (e: 'update:modelValue', modelValue: boolean): void
}