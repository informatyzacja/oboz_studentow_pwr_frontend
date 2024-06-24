import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'

// one chat messages
export const useChatStore = defineStore('chat', {
  state: () => ({ loading: true, error: null, data: null, url: 'chat/' }),
  getters: {
    ready() {
      return ready(this)
    }
  },
  actions: {
    fetchData() {
      return loadData(this)
    }
  }
})

// list of chats
export const useChatsStore = defineStore('chats', {
  state: () => ({ loading: true, error: null, data: null, url: 'chats/' }),
  getters: {
    ready() {
      return ready(this)
    },
    withId() {
      return (id) => {
        if (!this.data) return null
        return this.data.find((item) => {
          return item.id === id
        })
      }
    }
  },
  actions: {
    fetchData() {
      return loadData(this)
    }
  }
})

