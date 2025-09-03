<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="onRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <main>
        <TopBar title="BeerReal" />

        <BerealAlert v-if="apiDataStore.bereal?.data" :bereal_status="apiDataStore.bereal.data.bereal_status" />


        <LoadingIndicator v-if="apiDataStore.bereal?.loading" />
        <p v-if="apiDataStore.bereal?.error" class="error">{{ apiDataStore.bereal.error }}</p>

        <div class="padding-main">

          <div class="top-right-text">
            <span :class="{ active: selectedTab === 'oboz', inactive: selectedTab !== 'oboz' }"
              @click="setTab('oboz')">Obóz</span>
            /
            <span :class="{ active: selectedTab === 'frakcja', inactive: selectedTab !== 'frakcja' }"
              @click="setTab('frakcja')">Frakcja</span>

            <span class="separator">|</span>

            <span :class="{ active: selectedTime === 'dzisiaj', inactive: selectedTime !== 'dzisiaj' }"
              @click="setTime('dzisiaj')">Dzisiaj</span>
            /
            <span :class="{ active: selectedTime === 'all', inactive: selectedTime !== 'all' }"
              @click="setTime('all')">All time</span>

            <span class="separator">|</span>

            <span :class="{ active: selectedSort === 'popular', inactive: selectedSort !== 'popular' }"
              @click="setSort('popular')">Popularność</span>
            /
            <span :class="{ active: selectedSort === 'recent', inactive: selectedSort !== 'recent' }"
              @click="setSort('recent')">Ostatnie</span>
          </div>
          <div v-if="!apiDataStore.bereal?.loading && data.posts.length === 0" class="no-posts">
            <p>Brak postów do wyświetlenia</p>
          </div>

          <BerealPhoto v-for="post in data.posts" :key="post.id" :id="post.id" class="bereal-photo"
            :photo1="post.photo1" :photo2="post.photo2" :user_name="post.user_name"
            :user_profile_photo="post.user_photo" :num_likes="post.likes_count" :late="post.is_late"
            :liked="post.is_liked_by_user" :is_post_owner="post.is_post_owner" :user_id="post.user"
            @enlarge-photo="onEnlargePhoto" @post-deleted="onPostDeleted" />

          <ion-modal :is-open="enlargedPhoto !== null" @didDismiss="closeModal">
            <div class="modal-photo-container" @click.self="closeModal">
              <img :src="enlargedPhoto" class="modal-photo"
                :style="{ transform: `rotate(${rotation}deg) scale(${scale})` }" @click="rotatePhoto" />
            </div>
          </ion-modal>

          <ion-infinite-scroll v-if="data.pagination?.has_next" @ionInfinite="loadMore" threshold="100px">
            <ion-infinite-scroll-content loading-spinner="bubbles"
              loading-text="Ładowanie..."></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup>
/* Jeden <script setup> – wszystkie importy i logika tutaj */
import { ref, computed, onMounted } from "vue";
import { useApiDataStore } from "@/stores/api.js";
import { apiRequest } from "@/stores/functions";

import TopBar from "@/components/navigation/TopBar.vue";
import BerealAlert from "./components/BerealAlert.vue";
import LoadingIndicator from "../../components/LoadingIndicator.vue";
import BerealPhoto from "./components/BerealPhoto.vue";

/* Ionic components imports are optional for runtime, kept for clarity */
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
} from "@ionic/vue";

/* Local state */
const apiDataStore = useApiDataStore();

/* Ensure store shape (defensive) */
if (!apiDataStore.bereal) {
  apiDataStore.bereal = {
    loading: false,
    error: null,
    data: { posts: [], pagination: {}, bereal_status: {} },
    pagination: {},
  };
}

const selectedTab = ref("oboz");      // 'oboz' | 'frakcja'
const selectedTime = ref("dzisiaj");  // 'dzisiaj' | 'all'
const selectedSort = ref("popular");  // 'popular' | 'recent'
const pageSize = 10;
const currentPage = ref(1);

const enlargedPhoto = ref(null);
const rotation = ref(0);
const scale = ref(1);

/* computed shortcut to posts/pagination/status */
const data = computed(() => apiDataStore.bereal?.data || { posts: [], pagination: {}, bereal_status: {} });

/* Build query string; omit scope when 'all' */
function buildQuery(page = 1) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("page_size", pageSize);
  if (selectedTab.value && selectedTab.value !== "all") params.set("scope", selectedTab.value);
  if (selectedTime.value) params.set("time", selectedTime.value);
  if (selectedSort.value) params.set("sort", selectedSort.value);
  return params.toString();
}

/* Fetch function: replace=true -> reset list; replace=false -> append */
async function fetchData({ page = 1, replace = true, refresherEvent = null } = {}) {
  // set loading flag
  apiDataStore.bereal.loading = true;
  apiDataStore.bereal.error = null;

  try {
    const q = buildQuery(page);
    let res = await apiRequest(`../api2/bereal/home/?${q}`);

    // handle both axios-like response and plain parsed body
    if (res && res.data) res = res.data;
    if (!res) throw new Error("Brak odpowiedzi z serwera");

    const posts = res.posts || [];
    const pagination = res.pagination || {};
    const bereal_status = res.bereal_status || {};

    if (replace) {
      apiDataStore.bereal.data = { posts, pagination, bereal_status };
    } else {
      const current = apiDataStore.bereal.data.posts || [];
      apiDataStore.bereal.data = {
        posts: [...current, ...posts],
        pagination,
        bereal_status,
      };
    }

    apiDataStore.bereal.pagination = pagination;
    currentPage.value = pagination.current_page || page;
  } catch (err) {
    console.error("Błąd pobierania BeReal:", err);
    apiDataStore.bereal.error = err?.message || "Błąd ładowania";
  } finally {
    apiDataStore.bereal.loading = false;
    if (refresherEvent?.target) {
      try { refresherEvent.target.complete(); } catch (e) {}
    }
  }
}

/* Public handlers used in template */
async function onRefresh(ev) {
  currentPage.value = 1;
  await fetchData({ page: 1, replace: true, refresherEvent: ev });
}

function setTab(tab) {
  if (selectedTab.value === tab) return;
  selectedTab.value = tab;
  currentPage.value = 1;
  fetchData({ page: 1, replace: true });
}
function setTime(t) {
  if (selectedTime.value === t) return;
  selectedTime.value = t;
  currentPage.value = 1;
  fetchData({ page: 1, replace: true });
}
function setSort(s) {
  if (selectedSort.value === s) return;
  selectedSort.value = s;
  currentPage.value = 1;
  fetchData({ page: 1, replace: true });
}

async function loadMore(ev) {
  const pagination = apiDataStore.bereal.pagination || apiDataStore.bereal.data?.pagination || {};
  if (!pagination || !pagination.has_next) {
    try { ev.target.disabled = true; ev.target.complete(); } catch (e) {}
    return;
  }
  const next = (pagination.current_page || currentPage.value) + 1;
  try {
    await fetchData({ page: next, replace: false });
  } catch (e) {
    console.error("loadMore error", e);
  } finally {
    try {
      ev.target.complete();
      const afterPagination = apiDataStore.bereal.pagination || apiDataStore.bereal.data?.pagination || {};
      if (!afterPagination.has_next) ev.target.disabled = true;
    } catch (e) {}
  }
}

/* Photo modal helpers */
function onEnlargePhoto(photoUrl) {
  enlargedPhoto.value = photoUrl;
  rotation.value = 0;
  adjustScale();
}
function closeModal() {
  enlargedPhoto.value = null;
  rotation.value = 0;
  scale.value = 1;
}
function adjustScale() {
  if (Math.abs(rotation.value) % 180 === 90) {
    scale.value = window.innerHeight / window.innerWidth;
  } else {
    scale.value = 1;
  }
}
function rotatePhoto() {
  rotation.value = (rotation.value - 90) % 360;
  adjustScale();
}

function onPostDeleted(id) {
  if (!apiDataStore?.bereal?.data?.posts) return;
  apiDataStore.bereal.data.posts = apiDataStore.bereal.data.posts.filter(p => p.id !== id);
}

/* initial load */
onMounted(() => {
  currentPage.value = 1;
  fetchData({ page: 1, replace: true });
});
</script>

<style scoped>
.bereal-photo { margin-bottom: 8px; }

.modal-photo-container{
  display:flex;justify-content:center;align-items:center;height:100%;width:100%;background:rgba(0,0,0,0.9);
}

.modal-photo{
  max-width:90vw;max-height:90%;object-fit:contain;border:2px solid white;border-radius:20px;transition:transform 0.3s ease;
}

.top-right-text{display:flex;flex-wrap:wrap;justify-content:center;font-weight:bold;font-size:18px;cursor:pointer;user-select:none;margin:10px 0;z-index:10;}
.top-right-text span{padding:0 4px;}
.top-right-text .active{color:#FDCE7E;}
.top-right-text .inactive{color:#f5c47091;}

.padding-main{padding:0 16px 40px;}
.no-posts{text-align:center;color:gray;margin:2rem 0;}
</style>
