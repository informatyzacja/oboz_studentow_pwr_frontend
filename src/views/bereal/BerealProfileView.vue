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
                <TopBar title="BeerReal - Profil" />

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
                <div class="profile-spacer"></div>
                <div class="profile-posts-list">
                    <div class="profile-post" v-for="post in posts" :key="post.id">
                        <IonNavLink :router-link="`/bereal/post/${post.id}`" class="link">
                            <img :src="post.image" />
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
        'name': 'Jan Kowalski',
        'profile_photo': 'https://picsum.photos/seed/profile/100/100',
        posts: [
            { id: 1, image: 'https://picsum.photos/seed/post1/300/300' },
            { id: 2, image: 'https://picsum.photos/seed/post2/300/300' },
            { id: 3, image: 'https://picsum.photos/seed/post3/300/300' },
            { id: 4, image: 'https://picsum.photos/seed/post4/300/300' },
            { id: 5, image: 'https://picsum.photos/seed/post5/300/300' },
            { id: 6, image: 'https://picsum.photos/seed/post6/300/300' },
            { id: 7, image: 'https://picsum.photos/seed/post7/300/300' }
        ],
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
                apiRequest('../api2/tinder/upload-profile-photo/', 'POST', {
                    photo: photo.dataUrl,
                }).then(res => {
                    if (res.success) {
                        this.apiDataStore.profile.data[0].tinder_profile = res.tinder_profile;
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
    background-color: #c4c4c4;
}
.profile-post img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>