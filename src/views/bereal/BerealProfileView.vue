<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController, IonNavLink } from '@ionic/vue';
import { apiRequest } from '@/stores/functions'
import TopBar from '@/components/navigation/TopBar.vue'

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'

import RefreshIcon from '../../assets/icons8-refresh.png';
import { Camera, CameraResultType } from '@capacitor/camera';


</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar title="BeReal - Profil" />

                <div class="padding-main">
                    <div class="profile-header">
                        <div class="profile-photo-container">
                            <img :src="profile_photo" class="profile-photo" />
                            <div class="edit-icon" @click="changePhoto">
                                <img :src="RefreshIcon" alt="Edit Profile" />
                            </div>

                        </div>
                        <p class="name">{{ name }}</p>
                    </div>
                </div>
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data: () => ({
        'name': 'Jan Kowalski',
        'profile_photo': 'https://picsum.photos/seed/profile/100/100',
    }),
    computed: {
        ...mapStores(useApiDataStore),
    },
    async mounted() {
    },
    methods: {
        changePhoto() {
            Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
            }).then((photo) => {

                // TODO: Replace with your API endpoint
                apiRequest('XXXX', 'POST', {
                    photo: photo.dataUrl,
                }).then(res => {
                    if (res.success) {
                        // TODO: Update profile photo in your store or state
                    }
                });
            });
        }
    }
}
</script>

<style scoped>
.profile-header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.profile-photo-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.edit-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background-color: #c4c4c4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.edit-icon img {
    width: 70%;
    height: 70%;
    filter: invert(1);
}
.profile-photo {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-bottom: 10px;
}
.name {
    font-size: 1.6em;
    font-weight: bold;
}
</style>