<script setup>
import { IonPage, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import BerealPost from '../components/bereal/BerealPost.vue'
import ProfileInfo from '../components/bereal/ProfileInfo.vue'

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
        <TopBar title="Profil BeReal" :showBackButton="true" />
        
        <!-- Profile Info -->
        <div class="padding" v-if="apiDataStore.berealProfile.ready && apiDataStore.berealProfile.data">
          <ProfileInfo :profile="apiDataStore.berealProfile.data" />
        </div>

        <!-- User's Posts -->
        <div v-if="apiDataStore.berealProfile.ready && apiDataStore.berealProfile.posts.length">
          <h3>Posty użytkownika</h3>
          <div class="posts-container">
            <BerealPost 
              v-for="post in apiDataStore.berealProfile.posts" 
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
        <div v-else-if="apiDataStore.berealProfile.ready && !apiDataStore.berealProfile.posts.length" class="no-posts">
          <p>Ten użytkownik nie ma jeszcze żadnych postów.</p>
        </div>

        <!-- Loading indicator -->
        <LoadingIndicator v-if="apiDataStore.berealProfile.loading" />
        
        <!-- Error message -->
        <p v-if="apiDataStore.berealProfile.error" class="error">{{ apiDataStore.berealProfile.error }}</p>
      </main>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  components: {
    LoadingIndicator,
    BerealPost,
    ProfileInfo
  },
  computed: {
    ...mapStores(useApiDataStore),
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData(event) {
      const userId = this.$route.params.userId || 'me'
      
      try {
        await this.apiDataStore.berealProfile.fetchUserProfile(userId)
      } finally {
        if (event) {
          event.target.complete()
        }
      }
    },
    
    async onLikePost(postId) {
      try {
        await this.apiDataStore.berealPosts.likePost(postId)
        // Update the post in profile view as well
        const post = this.apiDataStore.berealProfile.posts.find(p => p.id === postId)
        if (post) {
          post.is_liked = true
          post.likes_count = (post.likes_count || 0) + 1
        }
      } catch (error) {
        console.error('Error liking post:', error)
      }
    },
    
    async onUnlikePost(postId) {
      try {
        await this.apiDataStore.berealPosts.unlikePost(postId)
        // Update the post in profile view as well
        const post = this.apiDataStore.berealProfile.posts.find(p => p.id === postId)
        if (post) {
          post.is_liked = false
          post.likes_count = Math.max((post.likes_count || 1) - 1, 0)
        }
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
        // Remove from profile posts as well
        this.apiDataStore.berealProfile.posts = this.apiDataStore.berealProfile.posts.filter(p => p.id !== postId)
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

.padding {
  padding: 0 20px;
}
</style>