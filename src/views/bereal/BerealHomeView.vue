<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController, IonNavLink, IonRefresher, IonRefresherContent } from '@ionic/vue';
import Tinder from '@/components/vue-tinder/Tinder.vue'
import { apiRequest } from '@/stores/functions'
import TopBar from '@/components/navigation/TopBar.vue'
import { refresh, close, heart, star, help } from 'ionicons/icons'
import OverlayView from '../../components/OverlayView.vue';
import ProfileCircle from '@/components/navigation/ProfileCircle.vue'

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'
import LoadingIndicator from '../../components/LoadingIndicator.vue';

import BerealPhoto from './components/BerealPhoto.vue';

import ItemBox from '../../components/ItemBox.vue'

import CameraIcon from '../../assets/icons8-camera-100.png';

</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <ion-refresher slot="fixed" @ionRefresh="fetchData($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <main>
                <TopBar title="BeerReal" />

                <div class="bereal_top_functions">
                    <ItemBox v-if="apiDataStore.bereal.data && !apiDataStore.bereal.data.bereal_status.can_post "
                        :big-text="'Przesłałeś/aś już dzisiaj BeerReala'" small />
                    <ItemBox
                        v-else-if="apiDataStore.bereal.data && apiDataStore.bereal.data.bereal_status.is_active && isEventActive"
                        :big-text="'Właśnie się dzieje! Zrób zdjecie ' + secondsLeft + 's...'" small />
                    <ItemBox
                        v-else-if="apiDataStore.bereal.data && (!apiDataStore.bereal.data.bereal_status.is_active || !isEventActive) && apiDataStore.bereal.data.bereal_status.was_today"
                        :big-text="'Dzisiejszy BeerReal był o ' + new Date(apiDataStore.bereal.data.bereal_status.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ale nadal możesz przesłać zdjęcie.'"
                        small />

                    <IonNavLink v-if="apiDataStore.bereal.data && apiDataStore.bereal.data.bereal_status.can_post"
                        router-link="/bereal/camera" router-animation="none">
                        <ItemBox big-text="Zrób zdjęcie" :leftIcon="CameraIcon" small leftIconWhite noRoundIcon />
                    </IonNavLink>
                </div>


                <LoadingIndicator v-if="apiDataStore.bereal.loading" />
                <p v-if="apiDataStore.bereal.error" class="error">{{ apiDataStore.bereal.error }}</p>

                <div v-if="apiDataStore.bereal.data">
                    <BerealPhoto v-for="post in apiDataStore.bereal.data.posts" :key="post.id" :id="post.id"
                        class="bereal-photo" :photo1="post.photo1" :photo2="post.photo2" :user_name="post.user_name"
                        :user_profile_photo="post.user_photo" :num_likes="post.likes_count" :late="post.is_late"
                        :liked="post.is_liked_by_user" />
                </div>
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data: () => ({
        berealEventDeadline: null,
        now: Date.now(),
        timerId: null
    }),
    computed: {
        ...mapStores(useApiDataStore),
        isEventActive() {
            return this.now < this.berealEventDeadline;
        },
        secondsLeft() {
            return Math.max(0, Math.floor((this.berealEventDeadline - this.now) / 1000));
        }
    },
    mounted() {
        this.timerId = setInterval(() => {
            this.now = Date.now();
            if (!this.isEventActive) {
                clearInterval(this.timerId);
                this.timerId = null;
            }
        }, 100);
        this.fetchData();
    },
    unmounted() {
        if (this.timerId) clearInterval(this.timerId);
    },
    methods: {
        async fetchData(event) {
            await this.apiDataStore.bereal.fetchData();
            if (event) event.target.complete();
            if (this.apiDataStore.bereal.data.bereal_status.is_active) {
                this.berealEventDeadline = new Date(this.apiDataStore.bereal.data.bereal_status.deadline);
            } else {
                this.berealEventDeadline = null;
            }
        }
    }
}
</script>

<style scoped>
.bereal-photo {
    margin: 10px;
}
.bereal_top_functions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
}
</style>