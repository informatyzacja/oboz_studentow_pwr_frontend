<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import OverlayView from '../components/OverlayView.vue'

import PointsItemView from './PointsItemView.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { API_URL, AUTH_HEADER } from '../config.js'
import { getCookie } from '../stores/functions.js'
</script>

<template>
    <TopBar title="Punkty" backLink="/admin-menu" />

    <div class="padding" v-if="apiDataStore.points.ready">
        <h3>Rodziaj grup</h3>
        <select v-model="selectedGroupType"
            @input="event => { selectedGroup = ''; selectedPointType = ''; selectedGroupType = event.target.value }">
            <option value="">Wszystkie</option>
            <option v-for="groupType in apiDataStore.points.groupTypes" :key="groupType" :value="groupType">
                {{ groupType }}
            </option>
        </select>

        <div v-if="selectedGroupType != ''">
            <h3>Kategoria punktów</h3>
            <select v-model="selectedPointType">
                <option value="">Wszystkie</option>
                <option v-for="pointType in apiDataStore.points.pointTypes(selectedGroupType)" :key="pointType"
                    :value="pointType">
                    {{ pointType }}
                </option>
            </select>
        </div>

        <div class="filters">
            <p>Filtry:</p>
            <div class="filterOption" :class="{ filterOptionSelected: niezatwierdzoneFilter }"
                @click="toggleNiezatwierdzoneFilter">Nie zatwierdzone</div>
            <select v-model="selectedGroup" v-if="selectedGroupType != ''">
                <option value="">Grupa</option>
                <option v-for="group in apiDataStore.points.groups(selectedGroupType)" :key="group.id" :value="group.id">
                    {{ group.name }}
                </option>
            </select>
        </div>


        <div style="margin-top: 20px;">
            <div v-for="(data, index) in filterNiezatwierdzone(apiDataStore.points.filtered(selectedGroupType, selectedPointType, selectedGroup))"
                :key="index">
                <PointsItemView :points="data.numberOfPoints" :date="data.date" :validated="data.validated"
                    :points_type="data.type.name + ' (' + data.type.points_min + ' - ' + data.type.points_max + ' pkt)'"
                    :description="data.description" :group_name="data.group.name"
                    :added_by="data.addedBy.first_name + ' ' + data.addedBy.last_name"
                    @click="showPointsOverlay(index)" />

                <OverlayView ref="pointsOverlay">
                    <div class="padding pointsOverlay">
                        <PointsItemView style="width:100%" :points="data.numberOfPoints" :date="data.date" :validated="data.validated"
                            :validatedBy="data.validatedBy.first_name + ' ' + data.validatedBy.last_name"
                            :validationDate="data.validationDate"
                            :points_type="data.type.name + ' (' + data.type.points_min + ' - ' + data.type.points_max + ' pkt)'"
                            :description="data.description" :group_name="data.group.name"
                            :added_by="data.addedBy.first_name + ' ' + data.addedBy.last_name" />

                        <button class="button success" @click="validatePoints(data)"
                            v-if="!data.validated && apiDataStore.permissions.ready && apiDataStore.permissions.hasPermission('can_validate_points') && !success && !loading">
                            Zatwierdź
                        </button>
                        <LoadingIndicator v-if="loading" inline small />
                        <p>{{ error }}</p>

                        <button class="button" @click="$refs.pointsOverlay[index].hide()">Zamknij</button>
                    </div>
                </OverlayView>
            </div>
        </div>
    </div>

    <LoadingIndicator v-if="apiDataStore.points.loading" />
    <p v-if="apiDataStore.points.error" class="error">{{ apiDataStore.points.error }}</p>
</template>


<script>
export default {
    data() {
        return {
            timer: null,
            selectedGroupType: '',
            selectedPointType: '',
            selectedGroup: '',
            niezatwierdzoneFilter: false,

            loading: false,
            error: null,
            success: null
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
        toggleNiezatwierdzoneFilter() {
            this.niezatwierdzoneFilter = !this.niezatwierdzoneFilter
        },
        filterNiezatwierdzone(points) {
            if (this.niezatwierdzoneFilter) {
                return points.filter(point => !point.validated)
            } else {
                return points
            }
        },
        showPointsOverlay(index) {
            this.error = null
            this.success = null
            this.$refs.pointsOverlay[index].show()
        },
        validatePoints(data) {
            if (this.apiDataStore.permissions.ready && this.apiDataStore.permissions.hasPermission('can_validate_points')) {
                this.loading = true;
                const csrftoken = getCookie('csrftoken')
                fetch(API_URL + '../staff-api/validate-points/' + data.id + '/', {
                    headers: Object.assign(
                        {},
                        { 'Content-type': 'application/json; charset=UTF-8', 'X-CSRFToken': csrftoken },
                        AUTH_HEADER
                    ),
                    method: 'PUT'
                })
                    .then((data) => {
                        if (data.ok) {
                            return data.json()
                        }
                        if (data.status === 403) {
                            window.location.href = '/login'
                        }
                        this.error = data.status + ' ' + data.statusText
                        this.success = false
                        throw new Error('Request failed!')
                    })
                    .then((data) => {
                        this.success = data.success
                        this.error = data.error
                        if (this.success) {
                            this.error = 'Zatwierdzono'
                        }
                    })
                    .catch((error) => {
                        console.error('There was an error!', error)
                    })
                    .finally(() => {
                        this.loading = false
                        this.apiDataStore.points.fetchData()
                    })
            }
        }
    },
    beforeUnmount() {
        clearInterval(this.timer)
    }
}
</script>

<style scoped>
h3 {
    background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    padding: 5px 2px;
    font-size: 13px;
}

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