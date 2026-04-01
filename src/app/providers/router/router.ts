import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
    {
        path: '/',
        name: 'menu',
        component: () => import('../../../pages/Menu/ui/MenuPage.vue')
    },
    {
        path: '/game',
        name: 'game',
        component: () => import('../../../pages/Game/ui/GamePage.vue')
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});