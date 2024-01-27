import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'
import { WS_API_URL, AUTH_TOKEN } from '../config'

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
                })
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
                    return item.locators < item.places
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
        connect() {
            if (this.socket) {
                return
            }
            this.reconnect = true
            this.loading = true
            this.socket = new WebSocket(WS_API_URL + 'house-signups/' + (AUTH_TOKEN ? ('?token=' + AUTH_TOKEN) : ''))
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
                    house.locators = data.locators
                    if (data.progress) house.housesignupprogress = data.progress
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
