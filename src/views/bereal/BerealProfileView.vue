<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController, IonNavLink } from '@ionic/vue';
import { apiRequest } from '@/stores/functions'
import TopBar from '@/components/navigation/TopBar.vue'

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'

import RefreshIcon from '../../assets/icons8-refresh.png';
import { Camera, CameraResultType } from '@capacitor/camera';

import { personCircle } from 'ionicons/icons';
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar v-if="$route.params.profile_id" title="BeerReal - Profil" auto-back-link/>
                <TopBar v-else title="BeerReal - Profil" />

                <div class="padding-main">
                    <div class="profile-header" v-if="apiDataStore.berealProfile.data">
                        <div class="profile-photo-container">
                            <img :src="apiDataStore.berealProfile.data.user.photo || personCircle" class="profile-photo" />
                            <div v-if="!$route.params.id" class="edit-icon" @click="changePhoto">
                                <img :src="RefreshIcon" alt="Edit Profile" />
                            </div>

                        </div>
                        <p class="name">{{ apiDataStore.berealProfile.data.user.first_name }} {{
                            apiDataStore.berealProfile.data.user.last_name }}</p>
                    </div>
                </div>
                <div class="profile-spacer"></div>
                <div class="profile-posts-list" v-if="apiDataStore.berealProfile.data">
                    <div class="profile-post" v-for="post in apiDataStore.berealProfile.data.posts" :key="post.id">
                        <IonNavLink :router-link="`/bereal/post/${post.id}`" class="link">
                            <img :src="post.photo1" />
                        </IonNavLink>
                    </div>
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
    },
    async mounted() {
        this.fetchData();
    },
    methods: {
        changePhoto() {
            Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
            }).then((photo) => {
                apiRequest('../api2/tinder/upload-profile-photo/', 'POST', {
                    photo: photo.dataUrl,
                }).then(res => {
                    if (res.success) {
                        this.apiDataStore.berealProfile.data.user.photo = res.tinder_profile.photo;
                    }
                });
            });
        },
        fetchData($event) {
            this.apiDataStore.berealProfile.data = null; // Reset data to avoid showing old data
            this.apiDataStore.berealProfile.id = this.$route.params.profile_id;
            this.apiDataStore.berealProfile.fetchData().then(() => {
                if ($event) $event.target.complete();
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
    object-fit: cover;
}
.name {
    font-size: 1.6em;
    font-weight: bold;
}
.profile-spacer {
    width: 100%;
    height: 3px;
    background-color: var(--theme-text);
}
.profile-posts-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
}
.profile-post {
    width: 100%;
    height: 100%;
    overflow: hidden;
    aspect-ratio: 1/1;
    background-color: #c4c4c4;
}
.profile-post img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>