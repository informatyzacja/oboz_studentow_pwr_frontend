<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import ItemBox from '../components/ItemBox.vue'

import rightArrow from '../assets/arrow.svg'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
    <main>
    <TopBar title="Ranking" backLink="/admin-menu" />

    <div class="padding-main" v-if="apiDataStore.points.ready">
        <h3>Rodziaj grupy</h3>
        <select v-model="selectedGroupType">
            <option v-for="groupType in apiDataStore.points.groupTypes" :key="groupType" :value="groupType">
                {{ groupType }}
            </option>
        </select>

        <div style="margin-top: 20px;" v-if="selectedGroupType != ''">
            <h3>Ranking na podstawie zatwierdzonych punktów</h3>
            <RouterLink 
                v-for="(data, index) in apiDataStore.points.ranking(selectedGroupType)"
                :key="index" 
                :to="(data.group.type.name=='Frakcja' ? '/frakcja/' : '/grupa/') + data.group.id">
                <ItemBox :bigText="data.group.name" :smallText="data.points + ' pkt'" :rightIcon="rightArrow" />
            </RouterLink>
        </div>
    </div>

    <LoadingIndicator v-if="apiDataStore.points.loading" />
    <p v-if="apiDataStore.points.error" class="error">{{ apiDataStore.points.error }}</p>
</main>
</template>


<script>
export default {
    data() {
        return {
            timer: null,
            selectedGroupType: 'Frakcja',
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
    },
    mounted() {
        this.apiDataStore.points.fetchData()
        this.timer = setInterval(this.apiDataStore.points.fetchData, 300000)
    },
    methods: {
      
    },
    beforeUnmount() {
        clearInterval(this.timer)
    }
}
</script>

<style scoped>


select {
    width: 100%;
    padding: 10px 35px 10px 15px;
    border-radius: 20px;
    border: 1px solid var(--text-gray);
    margin-bottom: 10px;
    font-size: 15px;
    font-family: 'Sui Generis';
    border: none;
    outline: none;
    color: white;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    background: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.66663 5.33337L8.00001 8.66671L11.3333 5.33337' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A") no-repeat;
    background-position: calc(100% - 15px) center !important;
    background-color: var(--bg-light);
}

.filters {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
}

.filters p {
    color: var(--text-gray);
}

.filterOption {
    background: var(--bg-light);
    padding: 8px 15px;
    border-radius: 20px;
    font-family: 'Sui Generis';
    color: white;
    cursor: pointer;
}

.filterOptionSelected {
    background: var(--radial-gradient);
}

.filters select {
    width: auto;
    margin: 0;
    font-size: 13px;
}

button {
    border-radius: 20px;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    font-family: 'Sui Generis';
    background-color: var(--bg-light);

    width: 130px;
    display: flex;
    justify-content: center;

    margin-top: 20px;
}

button.success {
    background-color: green;
}
.pointsOverlay {
    margin: 0;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>