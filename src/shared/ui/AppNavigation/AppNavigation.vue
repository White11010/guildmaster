<script setup lang="ts">
import { appNavigationItems } from '@/shared/model/AppNavigation/AppNavigation.constants';
import { useAppNavigationStore, type AppNavigationItem } from '@/shared/model/AppNavigation';
import { useRouter } from 'vue-router';

const router = useRouter()
const appNavigationStore = useAppNavigationStore()

function onTabItemClick(tab: AppNavigationItem) {
    appNavigationStore.setCurrentTab(tab.id)
    router.push(tab.path)
}
</script>

<template>
    <nav class="app-navigation">
        <ul class="app-navigation__nav-list">
            <li v-for="tab in appNavigationItems" :key="tab.path" class="app-navigation__nav-item">
                <button class="app-navigation__nav-item-button" :class="{
                    'app-navigation__nav-item-button--active': tab.id === appNavigationStore.currentTab
                }" @click="onTabItemClick(tab)">
                    {{ tab.title }}
                </button>
            </li>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
.app-navigation {
    height: fit-content;

    &__nav-list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        list-style: none;
        gap: 1rem;
        margin: 0;
        padding: 0;
    }

    &__nav-item-button {
        width: 100%;
        height: 5rem;
        font-size: 1.5rem;

        &--active {
            color: white;
            background: black;
            border-color: white;
        }
    }
}
</style>