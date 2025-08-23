<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController, IonNavLink, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import TopBar from '@/components/navigation/TopBar.vue'
import BerealAlert from './components/BerealAlert.vue';

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'
import LoadingIndicator from '../../components/LoadingIndicator.vue';
import { IonModal } from '@ionic/vue';

import BerealPhoto from './components/BerealPhoto.vue';

</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <ion-refresher slot="fixed" @ionRefresh="fetchData($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <main>
                <TopBar title="BeerReal" />
                <BerealAlert v-if="apiDataStore.bereal.data" :bereal_status="apiDataStore.bereal.data.bereal_status" />
                <div class="top-right-text">
                    <span 
                        :class="{ active: selectedTab === 'oboz', inactive: selectedTab !== 'oboz' }"
                        @click="selectedTab = 'oboz'">
                        Obóz
                    </span>
                    /
                    <span 
                        :class="{ active: selectedTab === 'frakcja', inactive: selectedTab !== 'frakcja' }"
                        @click="selectedTab = 'frakcja'">
                        Frakcja
                    </span>

                    <span class="separator">|</span>

                    <span 
                        :class="{ active: selectedTime === 'dzisiaj', inactive: selectedTime !== 'dzisiaj' }"
                        @click="selectedTime = 'dzisiaj'">
                        Dzisiaj
                    </span>
                    /
                    <span 
                        :class="{ active: selectedTime === 'all', inactive: selectedTime !== 'all' }"
                        @click="selectedTime = 'all'">
                        All time
                    </span>

                    <span class="separator">|</span>

                    <span 
                        :class="{ active: selectedSort === 'popular', inactive: selectedSort !== 'popular' }"
                        @click="selectedSort = 'popular'">
                        Popularność
                    </span>
                    /
                    <span 
                        :class="{ active: selectedSort === 'recent', inactive: selectedSort !== 'recent' }"
                        @click="selectedSort = 'recent'">
                        Ostatnie
                    </span>

                </div>

                <LoadingIndicator v-if="apiDataStore.bereal.loading" />
                <p v-if="apiDataStore.bereal.error" class="error">{{ apiDataStore.bereal.error }}</p>

                <div v-if="apiDataStore.bereal.data" class="padding-main">
                    <BerealPhoto v-for="post in apiDataStore.bereal.data.posts" :key="post.id" :id="post.id"
                        class="bereal-photo" :photo1="post.photo1" :photo2="post.photo2" :user_name="post.user_name"
                        :user_profile_photo="post.user_photo" :num_likes="post.likes_count" :late="post.is_late"
                        :liked="post.is_liked_by_user" :is_post_owner="post.is_post_owner" :user_id="post.user" @enlarge-photo="onEnlargePhoto"/>
                    <ion-modal :is-open="enlargedPhoto !== null" @didDismiss="closeModal">
                        <div class="modal-photo-container" @click.self="closeModal">
                            <img 
                                :src="enlargedPhoto" 
                                class="modal-photo"
                                :style="{ transform: `rotate(${rotation}deg) scale(${scale})` }"
                                @click="rotatePhoto"
                            />
                        </div>
                    </ion-modal>
                    <ion-infinite-scroll v-if="apiDataStore.bereal.pagination?.has_next" @ionInfinite="loadMore($event)"
                        threshold="100px">
                        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Ładowanie...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>

                    <div v-if="apiDataStore.bereal.data.posts.length === 0">
                        <p>Brak postów do wyświetlenia</p>
                    </div>
                </div>
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return {
            enlargedPhoto: null,
            rotation: 0,
            scale: 1,
            selectedTab: "oboz",
            selectedTime: "dzisiaj",
            selectedSort: "recent"
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData(event) {
            await this.apiDataStore.bereal.fetchData();
            if (event) event.target.complete();
        },
        async loadMore(event) {
            const pagination = this.apiDataStore.bereal.pagination || this.apiDataStore.bereal.data?.pagination;
            if (!pagination || !pagination.has_next) {
                event.target.disabled = true;
                event.target.complete();
                return;
            }
            const nextPage = (pagination.current_page || 1) + 1;
            await this.apiDataStore.bereal.fetchPage(nextPage, true);
            const updated = this.apiDataStore.bereal.pagination || this.apiDataStore.bereal.data?.pagination;
            if (!updated?.has_next) {
                event.target.disabled = true;
            }
            event.target.complete();
        },
        onPostDeleted(id) {
            if (!this.apiDataStore?.bereal?.data?.posts) return;
            this.apiDataStore.bereal.data.posts = this.apiDataStore.bereal.data.posts.filter(p => p.id !== id);
        },
        onEnlargePhoto(photoUrl) {
            this.enlargedPhoto = photoUrl
            this.rotation = 0
            this.adjustScale()
        },
        closeModal() {
            this.enlargedPhoto = null
            this.rotation = 0
        },
        adjustScale() {
            if (Math.abs(this.rotation) % 180 === 90) {
                this.scale = window.innerHeight / window.innerWidth
            } else {
                this.scale = 1
            }
        },
        rotatePhoto() {
            this.rotation = (this.rotation - 90) % 360
            this.adjustScale()
        }
    }
}

</script>

<style scoped>
.bereal-photo {
  margin-bottom: 8px;
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
.top-right-text {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  margin: 10px 0;
  z-index: 10;
}

.top-right-text span {
  padding: 0 4px;
}

.top-right-text .active {
  color: #FDCE7E;
}

.top-right-text .inactive {
  color: #f5c47091;
}






</style>





