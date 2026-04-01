export interface BaseModalProps {
    modelValue: boolean;
}
export interface BaseModalEmits {
    (e: 'update:modelValue', modelValue: boolean): void
}