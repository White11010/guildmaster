import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { AppModals } from '@/shared/model/AppModal/AppModal.types.ts';

export const useAppModalStore = defineStore('appModal', () => {
  const currentModal = ref<AppModals | null>(null);

  const isModalShown = computed(() => currentModal.value !== null);

  function setCurrentModal(modal: AppModals) {
    currentModal.value = modal;
  }

  function closeModal() {
    currentModal.value = null;
  }

  return {
    currentModal,
    isModalShown,
    setCurrentModal,
    closeModal
  };
});
