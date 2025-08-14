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
import { useBerealPostStore } from '@/stores/berealPost.js'

</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar title="BeerReal" auto-back-link />

                <BerealPhoto class="bereal-photo" photo1="https://picsum.photos/seed/post1/300/300"
                    photo2="https://picsum.photos/seed/post2/300/300" user_name="Jan Kowalski"
                    user_profile_photo="https://picsum.photos/seed/profile/100/100" :num_likes="18" />
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


</style>