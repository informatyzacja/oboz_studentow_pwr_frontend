<script setup>
import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'

import { IonNavLink, IonIcon } from '@ionic/vue';
import { personCircle } from 'ionicons/icons';
</script>

<template>
    <ion-nav-link router-link="/profil" router-direction="none" class="profile-circle">
        <img :src="avatar" v-if="avatar" />
        <ion-icon :icon="personCircle" v-else />
    </ion-nav-link>
</template>

<script>
export default {
    computed: {
        ...mapStores(useApiDataStore),
        profileData() {
            return this.apiDataStore.profile.data && this.apiDataStore.profile.data.length
                && this.apiDataStore.profile.data[0]
        },
        avatar() {
            return (this.profileData && this.profileData.tinder_profile && this.profileData.tinder_profile.photo) || (this.profileData && this.profileData.photo)
        }
    },
    mounted() {
        this.apiDataStore.profile.fetchData()
    }
}
</script>

<style scoped>
.profile-circle {
    position: absolute;
    top: calc(20px + var(--ion-safe-area-top)/2);
    right: 20px;
    color: var(--bg-light);
    z-index: 11;
}

img,
ion-icon {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;

    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
}
</style>