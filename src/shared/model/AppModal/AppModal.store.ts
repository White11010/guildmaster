import { defineStore } from "pinia";
import { AppModals } from "@/shared/model/AppModal/AppModal.types.ts";

interface State {
    currentModal: AppModals | null;
}

export const useAppModalStore = defineStore('appModal', {
    state: (): State => {
        return {
            currentModal: null
        };
    },
    getters: {
        isModalShown: (state) => state.currentModal !== null
    },
    actions: {
        setCurrentModal (modal: AppModals) {
            this.currentModal = modal;
        },
        closeModal () {
            this.currentModal = null;
        }
    }
});