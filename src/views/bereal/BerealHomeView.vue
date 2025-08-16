<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController, IonNavLink, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import TopBar from '@/components/navigation/TopBar.vue'
import BerealAlert from './components/BerealAlert.vue';

import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'
import LoadingIndicator from '../../components/LoadingIndicator.vue';

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

                <LoadingIndicator v-if="apiDataStore.bereal.loading" />
                <p v-if="apiDataStore.bereal.error" class="error">{{ apiDataStore.bereal.error }}</p>

                <div v-if="apiDataStore.bereal.data" class="padding-main">
                    <BerealPhoto v-for="post in apiDataStore.bereal.data.posts" :key="post.id" :id="post.id"
                        class="bereal-photo" :photo1="post.photo1" :photo2="post.photo2" :user_name="post.user_name"
                        :user_profile_photo="post.user_photo" :num_likes="post.likes_count" :late="post.is_late"
                        :liked="post.is_liked_by_user" :is_post_owner="post.is_post_owner" :user_id="post.user"
                        @post-deleted="onPostDeleted" />
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
    data: () => ({
    }),
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
            const pagination = this.apiDataStore.bereal.pagination || this.apiDataStore.bereal.data?.pagination
            if (!pagination || !pagination.has_next) {
                event.target.disabled = true
                event.target.complete()
                return
            }
            const nextPage = (pagination.current_page || 1) + 1
            await this.apiDataStore.bereal.fetchPage(nextPage, true)
            // Update local pagination reference
            const updated = this.apiDataStore.bereal.pagination || this.apiDataStore.bereal.data?.pagination
            if (!updated?.has_next) {
                event.target.disabled = true
            }
            event.target.complete()
        },
        onPostDeleted(id) {
            if (!this.apiDataStore?.bereal?.data?.posts) return
            // Reassign to trigger reactivity
            this.apiDataStore.bereal.data.posts = this.apiDataStore.bereal.data.posts.filter(p => p.id !== id)
        }
    }
}
</script>
