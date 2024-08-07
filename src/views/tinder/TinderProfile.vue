<script setup>

import { IonPage, IonContent, IonTextarea, IonButton } from '@ionic/vue';

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'

import MyTinderCard from './MyTinderCard.vue';
import OverlayView from '@/components/OverlayView.vue'
import { apiRequest } from '@/stores/functions';

import TopBar from '../../components/navigation/TopBar.vue';
import { Camera, CameraResultType } from '@capacitor/camera';
</script>

<template>
    <ion-page>
        <ion-content>
            <main v-if="profileData && profileData.tinder_profile">
                <TopBar title="Profil na tinderze" back-link="/profil" />
                <MyTinderCard class="tinder-card" :item="profileData.tinder_profile" editable
                    @editDescription="$refs.editDescriptionOverlay.show();"
                    v-if="profileData.tinder_profile.user && profileData.tinder_profile.photo && profileData.tinder_profile.description"
                    @addPhoto="addPhoto" ref="myTinderCard" />
                <div v-else-if="!profileData.tinder_profile.photo" class="onboarding">
                    <h4>Uwórz profil</h4>
                    <h5>Krok 1</h5>
                    <ion-button @click="addPhoto">Wybierz zdjęcie</ion-button>
                </div>
                <div v-else-if="!profileData.tinder_profile.description" class="onboarding">
                    <h4>Uwórz profil</h4>
                    <h5>Krok 2</h5>
                    <ion-button @click="$refs.editDescriptionOverlay.show()">Dodaj opis</ion-button>
                </div>


                <div class="profile-ready"
                    v-if="profileData.tinder_profile.user && profileData.tinder_profile.photo && profileData.tinder_profile.description">
                    <h3>Profil gotowy</h3>
                    <ion-button :routerLink="newProfile ? '/tinder/help' : '/tinder'" expand="block">Przejdź do
                        przeglądania</ion-button>
                </div>
            </main>

            <OverlayView ref="editDescriptionOverlay" v-if="profileData && profileData.tinder_profile">
                <div class="overlay-card">
                    <h4>Edytuj opis</h4>

                    <ion-textarea v-model="description" placeholder="Twój opis" autoGrow="true"
                        maxlength="250"></ion-textarea>

                    <ion-button class="button" size="small" @click="descriptionEdited">Zapisz</ion-button>
                </div>
            </OverlayView>

        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return {
            newProfile: false,
            description: '',
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
        profileData() {
            return this.apiDataStore.profile.data && this.apiDataStore.profile.data.length
                && this.apiDataStore.profile.data[0]
        },
    },
    async mounted() {
        if (!this.profileData) {
            await this.apiDataStore.profile.fetchData()
        }
        if (this.profileData && !this.profileData.tinder_profile.user) {
            this.newProfile = true;
        }
        if (this.profileData && this.profileData.tinder_profile.description) {
            this.description = this.profileData.tinder_profile.description
        }
    },
    methods: {
        async descriptionEdited() {
            apiRequest('../api2/tinder/upload-profile-data/', 'POST', {
                description: this.description
            }).then(res => {
                this.apiDataStore.profile.data[0].tinder_profile = res.tinder_profile
            })
            this.$refs.editDescriptionOverlay.hide()
        },
        addPhoto() {
            Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
            }).then((photo) => {
                if (this.$refs.myTinderCard) this.$refs.myTinderCard.notLoaded()

                apiRequest('../api2/tinder/upload-profile-photo/', 'POST', {
                    photo: photo.dataUrl,
                }).then(res => {
                    if (res.success) {
                        this.apiDataStore.profile.data[0].tinder_profile = res.tinder_profile;
                    }
                });
            });
        },
    }
}
</script>

<style scoped>
.overlay-card {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    background: var(--bg);
    padding: 20px 10px;
    border-radius: 20px;
    margin: 20px;
    margin-top: calc(20px + var(--ion-safe-area-top)/2);
}

.profile-ready {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
}

ion-textarea {
    width: 100%;
    --padding-start: 10px;
    --padding-end: 10px;
    --padding-top: 10px;
    --padding-bottom: 10px;
    --background: var(--bg-lighter);
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

.onboarding {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.onboarding h4 {
    margin: 0;
    margin-bottom: 20px;
    color: var(--light-text);
}

.onboarding h5 {
    margin: 0;
    margin-bottom: 20px;
}
</style>
