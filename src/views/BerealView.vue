<script setup>
import { IonPage, IonContent, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import BerealPost from '../components/bereal/BerealPost.vue'
import BerealStatus from '../components/bereal/BerealStatus.vue'
import BerealUploadButton from '../components/bereal/BerealUploadButton.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="fetchData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      
      <main>
        <TopBar title="BeReal Obozowy" />
        
        <!-- BeReal Status and Upload -->
        <div class="padding">
          <BerealStatus 
            v-if="apiDataStore.berealStatus.ready" 
            :status="apiDataStore.berealStatus.data" 
          />
          <BerealUploadButton 
            v-if="apiDataStore.berealStatus.ready && apiDataStore.berealStatus.data.can_post"
            @uploaded="onPhotoUploaded"
          />
        </div>

        <!-- Posts Feed -->
        <div v-if="apiDataStore.berealPosts.ready && apiDataStore.berealPosts.data.length">
          <h3>Posty z obozu</h3>
          <div class="posts-container">
            <BerealPost 
              v-for="post in apiDataStore.berealPosts.data" 
              :key="post.id"
              :post="post"
              @like="onLikePost"
              @unlike="onUnlikePost"
              @report="onReportPost"
              @delete="onDeletePost"
            />
          </div>
        </div>

        <!-- No posts message -->
        <div v-else-if="apiDataStore.berealPosts.ready && !apiDataStore.berealPosts.data.length" class="no-posts">
          <p>Brak postów. Bądź pierwszy i dodaj swoje zdjęcie!</p>
        </div>

        <!-- Loading indicator -->
        <LoadingIndicator v-if="apiDataStore.berealPosts.loading && !apiDataStore.berealPosts.data.length" />
        
        <!-- Error message -->
        <p v-if="apiDataStore.berealPosts.error" class="error">{{ apiDataStore.berealPosts.error }}</p>

        <!-- Infinite scroll -->
        <ion-infinite-scroll 
          v-if="apiDataStore.berealPosts.hasMore"
          @ionInfinite="loadMore"
          threshold="100px"
        >
          <ion-infinite-scroll-content loading-spinner="crescent">
            <div class="loading-text">Ładowanie więcej postów...</div>
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </main>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  components: {
    LoadingIndicator,
    BerealPost,
    BerealStatus,
    BerealUploadButton
  },
  data() {
    return {
      refreshTimer: null,
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
  },
  mounted() {
    this.fetchData()
    // Refresh data every 2 minutes
    this.refreshTimer = setInterval(() => {
      this.apiDataStore.berealStatus.fetchData()
    }, 120000)
  },
  beforeUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  },
  methods: {
    async fetchData(event) {
      try {
        await Promise.all([
          this.apiDataStore.berealStatus.fetchData(),
          this.apiDataStore.berealPosts.fetchData()
        ])
      } finally {
        if (event) {
          event.target.complete()
        }
      }
    },
    
    async loadMore(event) {
      try {
        await this.apiDataStore.berealPosts.loadMore()
      } finally {
        event.target.complete()
      }
    },
    
    async onLikePost(postId) {
      try {
        await this.apiDataStore.berealPosts.likePost(postId)
      } catch (error) {
        console.error('Error liking post:', error)
      }
    },
    
    async onUnlikePost(postId) {
      try {
        await this.apiDataStore.berealPosts.unlikePost(postId)
      } catch (error) {
        console.error('Error unliking post:', error)
      }
    },
    
    async onReportPost(postId, reason) {
      try {
        await this.apiDataStore.berealPosts.reportPost(postId, reason)
        // Show success message
        this.$ionic.toastController.create({
          message: 'Post został zgłoszony do moderacji',
          duration: 2000,
          position: 'top',
          color: 'success'
        }).then(toast => toast.present())
      } catch (error) {
        console.error('Error reporting post:', error)
      }
    },
    
    async onDeletePost(postId) {
      try {
        await this.apiDataStore.berealPosts.deletePost(postId)
        // Show success message
        this.$ionic.toastController.create({
          message: 'Post został usunięty',
          duration: 2000,
          position: 'top',
          color: 'success'
        }).then(toast => toast.present())
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    },
    
    onPhotoUploaded() {
      // Refresh posts after successful upload
      this.apiDataStore.berealPosts.fetchData()
    }
  }
}
</script>

<style scoped>
h3 {
  padding: 5px 20px;
  font-size: 16px;
  color: var(--theme-text);
}

.posts-container {
  padding: 0 10px;
}

.no-posts {
  text-align: center;
  padding: 40px 20px;
  color: var(--theme-text-secondary);
}

.error {
  color: var(--red);
  text-align: center;
  padding: 20px;
}

.loading-text {
  text-align: center;
  color: var(--theme-text-secondary);
  padding: 10px;
}

.padding {
  padding: 0 20px;
}
</style>