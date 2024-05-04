<script setup>

import { IonPage, IonContent, IonTextarea, IonButton } from '@ionic/vue';

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'

import MyTinderCard from './MyTinderCard.vue';
import OverlayView from '@/components/OverlayView.vue'
import { apiRequest } from '@/stores/functions';


</script>

<template>
    <ion-page>
        <ion-content>
            <main v-if="profileData && profileData.tinder_profile">
                <MyTinderCard class="tinder-card" :item="profileData.tinder_profile" editable
                    @editDescription="$refs.editDescriptionOverlay.show();" />
            </main>

            <OverlayView ref="editDescriptionOverlay" v-if="profileData && profileData.tinder_profile">
                <div class="overlay-card">
                    <h4>Edytuj opis</h4>

                    <ion-textarea v-model="profileData.tinder_profile.description" placeholder="Twój opis"
                        autoGrow="true" maxlength="250"></ion-textarea>

                    <ion-button class="button" size="small" @click="descriptionEdited">Gotowe</ion-button>
                </div>
            </OverlayView>

        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return {
            timer1: null,
            timer2: null,
            timer3: null,

            qrLoading: true,
            version: null,
            liveUpdateVersion: null,
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
        profileData() {
            return this.apiDataStore.profile.data && this.apiDataStore.profile.data.length
                && this.apiDataStore.profile.data[0]
        },
    },
    mounted() {
        this.apiDataStore.profile.fetchData()
    },
    methods: {
        async descriptionEdited() {
            apiRequest('../api2/tinder/upload-profile-data/', 'POST', {
                description: this.profileData.tinder_profile.description
            }).then(res => {
                this.apiDataStore.profile.data[0].tinder_profile = res.tinder_profile
            })
            this.$refs.editDescriptionOverlay.hide()
        },
    }
}
</script>

<style scoped>
.overlay-card {
    box-sizing: border-box;
    /* width: 100%; */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* margin: 30px 10px; */

    background: var(--bg-lighter);
    padding: 20px 10px;
    border-radius: 20px;
    margin: 20px;
    margin-top: calc(20px + var(--ion-safe-area-top)/2);
}

ion-textarea {
    width: 100%;
    --padding-start: 10px;
    --padding-end: 10px;
    --padding-top: 10px;
    --padding-bottom: 10px;
    --background: var(--bg-light);
    --border-radius: 10px;
    margin-bottom: 10px;
}

h4 {
    margin: 0 !important;
    margin-bottom: 10px !important;
}

.tinder-card {
    height: 500px;
    padding: 0 20px;
}
</style>
