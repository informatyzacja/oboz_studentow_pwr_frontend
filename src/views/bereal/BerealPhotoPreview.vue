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
                <TopBar title="BeReal" back-link="/bereal/camera/" />

                <BerealPhoto class="bereal-photo" :photo1="`data:image/jpeg;base64,${berealPostStore.photo1}`"
                    :photo2="`data:image/jpeg;base64,${berealPostStore.photo2}`" user_name="Jan Kowalski"
                    user_profile_photo="https://picsum.photos/seed/profile/100/100" :num_likes="-1" />


                <div class="bereal_post_options">
                    <IonNavLink router-link="/bereal/camera/" router-direction="back" class="link">
                        <IonButton>
                            Zrób nowe
                        </IonButton>
                    </IonNavLink>
                    <IonButton>
                        Opublikuj
                    </IonButton>
                </div>
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
        ...mapStores(useBerealPostStore),
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

.bereal_post_options {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 7px;
}

</style>