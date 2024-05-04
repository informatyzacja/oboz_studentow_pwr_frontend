<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'


import { IonPage, IonContent, IonNavLink } from '@ionic/vue';

import ChatCardView from './ChatCardView.vue'
</script>


<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <main>
                <top-bar title="Czaty" />
                <loading-indicator v-if="apiDataStore.chats.loading" />
                <div v-for="chat in apiDataStore.chats.data" :key="chat.id">
                    <ion-nav-link :router-link="'/czat/' + chat.id">
                        <ChatCardView :chat="chat" />
                    </ion-nav-link>
                </div>
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapStores(useApiDataStore)
    },
    mounted() {
        this.apiDataStore.chats.fetchData()
    }
}
</script>