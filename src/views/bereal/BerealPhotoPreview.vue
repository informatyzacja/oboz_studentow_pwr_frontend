<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController, IonNavLink, } from '@ionic/vue';
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
                <TopBar title="BeerReal" back-link="/bereal/camera/" />

                <BerealPhoto class="bereal-photo" :photo1="`data:image/jpeg;base64,${berealPostStore.photo1}`"
                    :photo2="`data:image/jpeg;base64,${berealPostStore.photo2}`" :user_name="apiDataStore.berealProfile.data && apiDataStore.berealProfile.data.user.first_name"
                    :user_profile_photo="apiDataStore.berealProfile.data && apiDataStore.berealProfile.data.user.photo"
                    :num_likes="-1"
                    :hide_options="true" />


                <div class="bereal_post_options">
                    <IonNavLink router-link="/bereal/camera/" router-direction="back" class="link">
                        <IonButton>
                            Zrób nowe
                        </IonButton>
                    </IonNavLink>
                    <IonButton @click="post" v-if="!loading">
                        Opublikuj
                    </IonButton>
                    <IonButton v-else>
                        <LoadingIndicator inline small />
                    </IonButton>
                </div>
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data: () => ({
        loading: false
    }),
    computed: {
        ...mapStores(useApiDataStore),
        ...mapStores(useBerealPostStore),
    },
    async mounted() {
        if (this.berealPostStore.photo1 === null || this.berealPostStore.photo2 === null) {
            const toast = await toastController.create({
                message: 'Nie wykonano zdjęć do publikacji',
                duration: 2000,
                position: 'top',
                color: 'danger'
            });
            await toast.present();
            this.$router.push('/bereal/home');
        }
        this.apiDataStore.berealProfile.id = null;
        this.apiDataStore.berealProfile.fetchData();
    },
    methods: {
        post() {
            this.loading = true
            apiRequest('../api2/bereal/upload/', 'POST', {
                photo1: this.berealPostStore.photo1,
                photo2: this.berealPostStore.photo2,
            }).then(res => {
                if (res.success) {
                    toastController.create({
                        message: 'Post został opublikowany!',
                        duration: 2000,
                        color: 'success',
                        position: 'top'
                    }).then(toast => toast.present())
                    this.berealPostStore.clear()
                    this.apiDataStore.bereal.data = null
                    this.$router.push('/bereal/home')
                }
            }).finally(() => {
                this.loading = false
            });
        }
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