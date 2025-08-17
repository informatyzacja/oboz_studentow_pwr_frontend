import { defineStore } from 'pinia'

export const useBerealPostStore = defineStore('berealPost', {
    state: () => ({ photo1: null, photo2: null }),
    getters: {
    },
    actions: {
        clear() {
            this.photo1 = null;
            this.photo2 = null;
        }
    }
})
