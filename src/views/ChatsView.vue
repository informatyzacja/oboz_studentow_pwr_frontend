<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'


import { IonPage, IonContent, IonNavLink } from '@ionic/vue';

import ChatCardView from './ChatCardView.vue'
import ProfileCircle from '../components/navigation/ProfileCircle.vue'

import moment from 'moment';
import _ from 'lodash';

</script>


<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <top-bar title="Czaty" />
                <ProfileCircle />
                <loading-indicator v-if="apiDataStore.chats.loading" />
                <div v-for="chat in orderedChats" :key="chat.id">
                    <ion-nav-link :router-link="'/czat/' + chat.id">
                        <ChatCardView :chat="chat" />
                    </ion-nav-link>
                </div>
                <div v-if="apiDataStore.chats.data && apiDataStore.chats.data.length === 0">
                    <h3>Brak czatów</h3>
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
        ...mapStores(useApiDataStore),
        orderedChats() {
            this.apiDataStore.chats.data;
            return this.apiDataStore.chats.ready && _.orderBy(this.apiDataStore.chats.data, ['last_message.date'], ['desc'])
        }
    },
    mounted() {
        this.apiDataStore.chats.fetchData()
    }
}
</script>

<style scoped>
h3 {
    text-align: center;
    margin-top: 20px;
}
</style>