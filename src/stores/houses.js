import { defineStore } from 'pinia'
import { loadData, ready, apiSocket } from '@/stores/functions.js'

export const useHousesStore = defineStore('houses', {
    state: () => ({ loading: true, error: null, data: null, url: 'houses/' }),
    getters: {
        ready() {
            return ready(this)
        },
        houseWithId() {
            return (id) => {
                if (!this.ready || !this.data) {
                    return []
                }
                return this.data.find((item) => {
                    return item.id == id
                }) || null
            }
        },
        housesWithoutId() {
            return (id) => {
                if (!this.ready || !this.data) {
                    return []
                }
                return this.housesWithFreePlaces().filter((item) => {
                    return item.id != id
                })
            }
        },
        housesWithFreePlaces() {
            return () => {
                if (!this.ready || !this.data) {
                    return []
                }
                return this.data.filter((item) => {
                    return item.locators < item.places && item.signup_open
                })
            }
        }
    },
    actions: {
        fetchData() {
            loadData(this)
        }
    }
})


export const useHouseSignupsStore = defineStore('houseSignups', {
    state: () => ({
        reconnect: true,
        socket: null,
        error: null,
        loading: false,
    }),
    getters: {
        ready() {
            return this.socket != null
        }
    },
    actions: {
        async connect() {
            if (this.socket) {
                return
            }
            this.reconnect = true
            this.loading = true
            this.socket = await apiSocket('house-signups/')
            this.socket.onopen = () => {
                this.error = null
                this.loading = false
            }
            this.socket.onmessage = (e) => {
                const data = JSON.parse(e.data)
                if (data.event == 'error') {
                    this.error = data.message
                } else if (data.event == 'update') {
                    var house = useHousesStore().houseWithId(data.house);
                    if (!house) {
                        useHousesStore().fetchData()
                        return
                    }
                    house.locators = data.locators
                    if ('progress' in data) house.housesignupprogress = data.progress
                    if ('locators_data' in data) house.locators_data = data.locators_data
                }
            }
            this.socket.onclose = () => {
                this.loading = false
                this.socket = null
                setTimeout(() => {
                    if (this.reconnect) {
                        this.connect()
                    }
                }, 1000)
            }
            this.socket.onerror = (e) => {
                console.error('Socket encountered error: ', e.message, 'Closing socket');
                this.error = e
                this.loading = false
            }
        },
        disconnect() {
            this.reconnect = false
            if (this.socket) {
                this.socket.close()
            }
        }
    }
})


export const useHouseSignupsInfoStore = defineStore('houseSignupsInfo', {
    state: () => ({ loading: true, error: null, data: null, url: '../api2/get-house-signups-info/' }),
    getters: {
        ready() {
            return ready(this)
        },
    },
    actions: {
        fetchData() {
            loadData(this)
        }
    }
})