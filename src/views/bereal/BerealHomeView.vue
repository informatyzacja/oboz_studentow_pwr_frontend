<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController, IonNavLink } from '@ionic/vue';
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
            <main>
                <TopBar title="BeReal" />

                <div class="bereal_top_functions">
                    <ItemBox big-text="Właśnie się dzieje! Zrób zdjecie 54s..." small />

                    <IonNavLink router-link="/bereal/camera" router-animation="none">
                        <ItemBox big-text="Zrób zdjęcie" :leftIcon="CameraIcon" small leftIconWhite noRoundIcon />
                    </IonNavLink>
                </div>

                <BerealPhoto v-for="photo in photosRange" :key="photo" :id="photo" class="bereal-photo"
                    photo1="https://picsum.photos/seed/picsum/800/600"
                    photo2="https://picsum.photos/seed/picsum2/800/600" user_name="Jan Kowalski"
                    user_profile_photo="https://picsum.photos/seed/profile/100/100" :num_likes="42" :late="true" />
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data: () => ({
    }),
    computed: {
        ...mapStores(useApiDataStore),
        photosRange() {
            return Array.from({ length: 5 }, (_, i) => i);
        }
    },
    async mounted() {
    },
    methods: {
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
}
</style>