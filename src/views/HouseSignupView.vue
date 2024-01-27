<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import HouseCard from '../components/HouseCard.vue'

</script>


<template>
    <main>
        <TopBar title="Zapisy na pokoje" backLink="/" />

        <div v-if="apiDataStore.houses.ready && apiDataStore.profile.ready && apiDataStore.profile.data[0].house"
            class="padding">

            <h3>Twój pokój</h3>
            <div class="my-house">
                <RouterLink :to="{ name: 'zapisy-na-domki-detail', params: { id: apiDataStore.profile.data[0].house.id } }">
                    <HouseCard :key="apiDataStore.profile.data[0].house.id"
                        :house="apiDataStore.houses.houseWithId(apiDataStore.profile.data[0].house.id)" />
                </RouterLink>
            </div>

            <h3>Pozostałe pokoje</h3>
        </div>
        <div class="houses" v-if="apiDataStore.houses.ready && apiDataStore.profile.ready">
            <RouterLink :to="{ name: 'zapisy-na-domki-detail', params: { id: house.id } }" :key="house.id"
                v-for="house in apiDataStore.houses.housesWithoutId(apiDataStore.profile.data[0].house ? apiDataStore.profile.data[0].house.id : null)">
                <HouseCard :key="house.id" :house="house" />
            </RouterLink>
        </div>
        <LoadingIndicator v-if="apiDataStore.houses.loading" />
        <p v-if="apiDataStore.houses.error || apiDataStore.profile.error" class="error">{{ apiDataStore.houses.error ||
            apiDataStore.profile.error }}</p>
    </main>
</template>

<script>
export default {
    data() {
        return {
            housesTimer: null,
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
    },
    mounted() {
        this.apiDataStore.houses.fetchData()
        this.apiDataStore.profile.fetchData()
        this.apiDataStore.houseSignups.connect()

        this.housesTimer = setInterval(() => {
            this.apiDataStore.houses.fetchData()
        }, 1000 * 90)
    },
    beforeUnmount() {
        clearInterval(this.housesTimer)

        // disconnect from the websocket if not leaving for the house detail view
        if (this.$route.name !== 'zapisy-na-domki-detail') {
            this.apiDataStore.houseSignups.disconnect()
        }
    },
}
</script>

<style scoped>
.houses {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    width: 100%;
    padding: 0 20px;
}

.houses>a {
    width: calc(50% - 10px);
}

.my-house {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: center;
}

.my-house>a {
    width: calc(70% - 10px);
}
</style>