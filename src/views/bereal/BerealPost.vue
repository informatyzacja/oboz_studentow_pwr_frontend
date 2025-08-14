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

</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar title="BeerReal" auto-back-link />

                <BerealPhoto class="bereal-photo" v-if="data" :photo1="data.photo1" :photo2="data.photo2" :id="data.id"
                    :user_name="data.user_name" :user_profile_photo="data.user_photo" :num_likes="data.likes_count"
                    :late="data.is_late" :liked="data.is_liked_by_user" :is_post_owner="data.is_post_owner" />
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data: () => ({
        data: null
    }),
    computed: {
        ...mapStores(useApiDataStore),
    },
    async mounted() {
        this.fetchData();
    },
    watch: {
        '$route.params.id': 'fetchData'
    },
    methods: {
        fetchData() {
            if (!this.$route.params.post_id) return;

            apiRequest(
                `../api2/bereal/post/${this.$route.params.post_id}/`,
            ).then(res => {
                if (res.success) {
                    this.data = res.post;
                }
            });
        }
    }
}
</script>

<style scoped>
.bereal-photo {
    margin: 10px;
}


</style>