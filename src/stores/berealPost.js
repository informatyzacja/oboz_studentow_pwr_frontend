import { defineStore } from 'pinia'
import { App } from '@capacitor/app';
import * as LiveUpdates from '@capacitor/live-updates';

export const useBerealPostStore = defineStore('berealPost', {
    state: () => ({ photo1: null, photo2: null }),
    getters: {
    },
    actions: {
    }
})
