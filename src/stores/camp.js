import { defineStore } from 'pinia'
import { getActiveCampId, setActiveCampId } from '@/functions/login.js'
import { apiRequest } from '@/stores/functions.js'
import router from '@/router/index.js'

export const useCampStore = defineStore('camp', {
    state: () => ({
        activeCampId: null,
        camps: [],
        loading: false,
        error: null,
    }),
    actions: {
        async loadPersistedCampId() {
            const campId = await getActiveCampId()
            if (campId) {
                this.activeCampId = String(campId)
            }
        },
        async fetchAndSetCamp() {
            this.loading = true
            this.error = null
            try {
                const data = await apiRequest('../api2/camps/my/')
                if (!data || !Array.isArray(data) || data.length === 0) {
                    this.camps = []
                    this.activeCampId = null
                    await setActiveCampId(null)
                    return
                }
                this.camps = data
                const active = data.find((c) => c.is_active) || data[data.length - 1]
                this.activeCampId = String(active.id)
                await setActiveCampId(active.id)
            } catch (e) {
                this.error = e
            } finally {
                this.loading = false
            }
        },
        async switchCamp(campId) {
            this.activeCampId = String(campId)
            await setActiveCampId(campId)
            router.replace('/')
        },
    },
})
