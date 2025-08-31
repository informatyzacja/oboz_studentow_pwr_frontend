<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController, IonNavLink } from '@ionic/vue';
import { apiRequest } from '@/stores/functions'
import TopBar from '@/components/navigation/TopBar.vue'

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'

import BerealPhoto from './components/BerealPhoto.vue';
import { Media } from "@capacitor-community/media";

</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar title="BeerReal" auto-back-link />

                <BerealPhoto class="bereal-photo" v-if="data" :photo1="data.photo1" :photo2="data.photo2" :id="data.id"
                    :user_name="data.user_name" :user_profile_photo="data.user_photo" :num_likes="data.likes_count"
                    :late="data.is_late" :liked="data.is_liked_by_user" :is_post_owner="data.is_post_owner"
                    @post-deleted="onPostDeleted" @enlarge-photo="onEnlargePhoto" />

                <div v-if="data?.is_post_owner" class="post-actions">
                    <button class="download-btn" @click="downloadPhoto" v-if="!loading">Zapisz zdjęcia w galerii</button>
                    <ion-spinner v-if="loading" class="spinner" name="dots" color="light" />
                </div>

                <ion-modal :is-open="enlargedPhoto !== null" @didDismiss="closeModal">
                    <div class="modal-photo-container" @click.self="closeModal">
                        <img :src="enlargedPhoto" class="modal-photo" :style="{ transform: `rotate(${rotation}deg)` }"
                            @click="rotatePhoto" />
                    </div>
                </ion-modal>
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data: () => ({
        data: null,
        enlargedPhoto: null,
        rotation: 0,
        loading: false,
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
            console.log("Dane BeerReal:", this.apiDataStore.bereal.data);

            apiRequest(
                `../api2/bereal/post/${this.$route.params.post_id}/`,
            ).then(res => {
                if (res.success) {
                    this.data = res.post;
                }
            });
        },
        onPostDeleted() {
            if (!this.apiDataStore?.bereal?.data?.posts) return
            // Reassign to trigger reactivity
            this.apiDataStore.bereal.data.posts = this.apiDataStore.bereal.data.posts.filter(p => p.id !== this.data?.id)
            if (this.$router) this.$router.back()
        },
        onEnlargePhoto(photoUrl) {
            this.enlargedPhoto = photoUrl
            this.rotation = 0
        },
        closeModal() {
            this.enlargedPhoto = null
            this.rotation = 0
        },
        rotatePhoto() {
            this.rotation = (this.rotation - 90) % 360
        }, 
        async downloadPhoto() {
            if (this.loading) return;
            if (!this.data) return;
            this.loading = true;
            try {
                await Media.savePhoto({
                    path: this.data.photo1
                });
                await Media.savePhoto({
                    path: this.data.photo2
                });
            } catch (error) {
                // Handle error here
            } finally {
                this.loading = false;
                toastController.create({
                    message: 'Zdjęcia zostały zapisane!',
                    duration: 2000,
                    color: 'success',
                    position: 'top'
                }).then(toast => toast.present());
            }
        }
        
    }
}
</script>

<style scoped>
.bereal-photo {
    margin: 10px;
}
.post-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.download-btn {
  background-color: #98794A;
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}


.modal-photo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,0.9);
}

.modal-photo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 2px solid white;
  border-radius: 20px;
  transition: transform 0.3s ease;
}


</style>
