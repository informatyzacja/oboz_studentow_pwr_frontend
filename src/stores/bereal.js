import { defineStore } from 'pinia'
import { apiRequest } from './functions.js'
import { getAuthorizationHeader } from '../functions/login.js'

// BeReal Status Store
export const useBerealStatusStore = defineStore('berealStatus', {
  state: () => ({
    data: null,
    loading: false,
    error: null,
    ready: false,
  }),
  actions: {
    async fetchData() {
      this.loading = true
      this.error = null
      try {
        const data = await apiRequest('../api2/bereal/status/')
        this.data = data
        this.ready = true
      } catch (error) {
        this.error = 'Błąd połączenia z serwerem'
        console.error('BeReal status fetch error:', error)
      } finally {
        this.loading = false
      }
    }
  }
})

// BeReal Posts Store  
export const useBerealPostsStore = defineStore('berealPosts', {
  state: () => ({
    data: [],
    loading: false,
    error: null,
    ready: false,
    nextPage: null,
    hasMore: true,
  }),
  actions: {
    async fetchData(page = 1) {
      if (page === 1) {
        this.loading = true
        this.data = []
      }
      this.error = null
      try {
        const url = page === 1 ? '../api2/bereal/posts/' : `../api2/bereal/posts/?page=${page}`
        const response = await apiRequest(url)
        
        if (page === 1) {
          this.data = response.results || []
        } else {
          this.data.push(...(response.results || []))
        }
        
        this.nextPage = response.next ? page + 1 : null
        this.hasMore = !!response.next
        this.ready = true
      } catch (error) {
        this.error = 'Błąd połączenia z serwerem'
        console.error('BeReal posts fetch error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async loadMore() {
      if (this.hasMore && this.nextPage && !this.loading) {
        await this.fetchData(this.nextPage)
      }
    },
    
    async likePost(postId) {
      try {
        await apiRequest(`../api2/bereal/posts/${postId}/like/`, 'POST')
        const post = this.data.find(p => p.id === postId)
        if (post) {
          post.is_liked = true
          post.likes_count = (post.likes_count || 0) + 1
        }
      } catch (error) {
        console.error('Error liking post:', error)
        throw error
      }
    },
    
    async unlikePost(postId) {
      try {
        await apiRequest(`../api2/bereal/posts/${postId}/unlike/`, 'POST')
        const post = this.data.find(p => p.id === postId)
        if (post) {
          post.is_liked = false
          post.likes_count = Math.max((post.likes_count || 1) - 1, 0)
        }
      } catch (error) {
        console.error('Error unliking post:', error)
        throw error
      }
    },
    
    async reportPost(postId, reason) {
      try {
        await apiRequest(`../api2/bereal/posts/${postId}/report/`, 'POST', { reason })
      } catch (error) {
        console.error('Error reporting post:', error)
        throw error
      }
    },
    
    async deletePost(postId) {
      try {
        await apiRequest(`../api2/bereal/posts/${postId}/`, 'DELETE')
        this.data = this.data.filter(p => p.id !== postId)
      } catch (error) {
        console.error('Error deleting post:', error)
        throw error
      }
    }
  }
})

// BeReal User Profile Store
export const useBerealProfileStore = defineStore('berealProfile', {
  state: () => ({
    data: null,
    posts: [],
    loading: false,
    error: null,
    ready: false,
  }),
  actions: {
    async fetchUserProfile(userId) {
      this.loading = true
      this.error = null
      try {
        const [profileData, postsData] = await Promise.all([
          apiRequest(`../api2/bereal/profile/${userId}/`),
          apiRequest(`../api2/bereal/profile/${userId}/posts/`)
        ])
        
        this.data = profileData
        this.posts = postsData.results || []
        this.ready = true
      } catch (error) {
        this.error = 'Błąd połączenia z serwerem'
        console.error('BeReal profile fetch error:', error)
      } finally {
        this.loading = false
      }
    }
  }
})

// BeReal Upload Store
export const useBerealUploadStore = defineStore('berealUpload', {
  state: () => ({
    uploading: false,
    error: null,
  }),
  actions: {
    async uploadPhoto(imageData) {
      this.uploading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('image', imageData)
        
        const response = await fetch(import.meta.env.VITE_API_URL + '../api2/bereal/posts/', {
          method: 'POST',
          headers: await getAuthorizationHeader(),
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Upload failed')
        }
        
        return await response.json()
      } catch (error) {
        this.error = 'Błąd podczas przesyłania zdjęcia'
        console.error('BeReal upload error:', error)
        throw error
      } finally {
        this.uploading = false
      }
    }
  }
})