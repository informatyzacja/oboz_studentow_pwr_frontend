<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { API_URL, AUTH_HEADER } from '../config.js'
import { getCookie } from '../stores/functions.js'
</script>

<template>
    <TopBar title="Dodaj punkty" :backLink="$router.options.history.state.back || '/admin-menu'" />

    <div class="padding" v-if="apiDataStore.pointTypes.ready">
        <h3>Rodziaj grupy</h3>
        <select v-model="selectedGroupType"
            @input="event => { selectedGroup = ''; selectedPointType = ''; selectedGroupType = event.target.value }"
            :disabled="disabled"
            >
            <option disabled value="">Wybierz rodzaj grupy</option>
            <option v-for="groupType in apiDataStore.pointTypes.data.groupTypes" :key="groupType.id" :value="groupType.name">
                {{ groupType.name }}
            </option>
        </select>

        <div v-if="selectedGroupType">
            <h3>Kategoria punktów</h3>
            <select v-model="selectedPointType"
            :disabled="disabled"
            >
                <option disabled value="">Wybierz kategorię punktów</option>
                <option v-for="pointType in apiDataStore.pointTypes.forGroupType(selectedGroupType)" :key="pointType.id"
                    :value="pointType.id">
                    {{ pointType.name }}
                </option>
            </select>
        </div>

        <div  v-if="selectedGroupType">
            <h3>Grupa</h3>
            <select v-model="selectedGroup"
            :disabled="disabled"
            >
                <option disabled value="">Wybierz grupę</option>
                <option value="scan">SKANUJ</option>
                <option v-for="group in apiDataStore.pointTypes.groupsWithGroupType(selectedGroupType)" :key="group.id" :value="group.id">
                    {{ group.name }}
                </option>
            </select>
        </div>
        
        <div v-if="selectedGroupType && selectedPointType && apiDataStore.pointTypes.withTypes(selectedGroupType,selectedPointType)">
            <h3>Ile punktów ({{apiDataStore.pointTypes.withTypes(selectedGroupType,selectedPointType).points_min}} - {{apiDataStore.pointTypes.withTypes(selectedGroupType,selectedPointType).points_max}})</h3>
            <input type="number" v-model="points" 
            :min="apiDataStore.pointTypes.withTypes(selectedGroupType,selectedPointType).points_min" 
            :max="apiDataStore.pointTypes.withTypes(selectedGroupType,selectedPointType).points_max"
            :disabled="disabled"
            />

            <h3>Opis</h3>
            <textarea v-model="description" rows="4" cols="50"
            :disabled="disabled"
            ></textarea>

            <button class="button success" @click="addPoints" v-if="points != 0 && selectedGroup && apiDataStore.pointTypes.withTypes(selectedGroupType,selectedPointType).points_min <= points && points <= apiDataStore.pointTypes.withTypes(selectedGroupType,selectedPointType).points_max && !loading && !success">Dodaj</button>
            <LoadingIndicator v-if="loading" />
            <p class="success">{{ info }}</p>
            <p v-if="error" class="error">{{ error }}</p>
            <button v-if="success" class="button" @click="reset">Dodaj kolejne</button>
        </div>
        <p v-else-if="selectedGroupType && selectedPointType && !apiDataStore.pointTypes.withTypes(selectedGroupType,selectedPointType)" class="error">Ten rodzaj grupy nie może posiadać podanej kategorii punktów</p>



    </div>

    <LoadingIndicator v-if="apiDataStore.pointTypes.loading" />
    <p v-if="apiDataStore.pointTypes.error" class="error">{{ apiDataStore.pointTypes.error }}</p>
</template>


<script>
export default {
    data() {
        return {
            timer: null,
            selectedGroupType: 'Frakcja',
            selectedPointType: '',
            selectedGroup: '',

            loading: false,
            error: null,
            success: null,
            info: '',

            points: 0,
            description: '',

            disabled: false,
        }
    },
    watch: {
        selectedPointType(newPointsType) {
            this.$route.params.pointTypeId = newPointsType
            this.$router.replace({ params: this.$route.params })
        },
        selectedGroup(newGroup) {
            if (newGroup == 'scan') {
                this.$router.push({ name: 'skaner-punkty', params: { pointTypeId: this.selectedPointType } })
                return
            }
            this.$route.params.groupId = newGroup
            this.$router.replace({ params: this.$route.params })
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
    },
    mounted() {
        if ( this.apiDataStore.pointTypes.ready) {
            if (this.$route.params.groupId) {
                this.selectedGroup = parseInt(this.$route.params.groupId)
                this.selectedGroupType = this.apiDataStore.pointTypes.getGroupById(this.selectedGroup).type.name
            }
            this.selectedPointType = parseInt(this.$route.params.pointTypeId) || ''
        }

        this.apiDataStore.pointTypes.fetchData()
        this.timer = setInterval(this.apiDataStore.pointTypes.fetchData, 300000)
    },
    methods: {
        reset() {
            this.loading= false
            this.error= null
            this.success= null
            this.info= ''
            this.points= 0
            this.description= ''
            this.disabled= false
        },
        addPoints() {
            if (this.apiDataStore.permissions.ready && this.apiDataStore.permissions.hasPermission('can_add_points')) {
                if (this.apiDataStore.pointTypes.withTypes(this.selectedGroupType,this.selectedPointType).points_min > this.points || this.apiDataStore.pointTypes.withTypes(this.selectedGroupType,this.selectedPointType).points_max < this.points) {
                    alert("Niepoprawna ilość punktów")
                    return
                }
                this.disabled = true
                this.loading = true;
                const csrftoken = getCookie('csrftoken')
                const data = {
                    group: this.selectedGroup,
                    numberOfPoints: this.points,
                    description: this.description,
                    type: this.selectedPointType
                }
                fetch(API_URL + '../staff-api/add-points/', {
                    headers: Object.assign(
                        {},
                        { 'Content-type': 'application/json; charset=UTF-8', 'X-CSRFToken': csrftoken },
                        AUTH_HEADER
                    ),
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                    .then((data) => {
                        if (data.status === 403) {
                            window.location.href = '/login'
                            return
                        }
                        if (data.ok) {
                            return data.json()
                        }
                        this.error = data.status + ' ' + data.statusText
                        this.success = false
                        this.disabled = false
                        throw new Error('Request failed!')
                    })
                    .then((data) => {
                        this.success = data.success
                        this.error = data.error
                        if (this.success) {
                            this.info = 'Dodano punkty'
                        }
                    })
                    .catch((error) => {
                        console.error('There was an error!', error)
                    })
                    .finally(() => {
                        this.loading = false
                        this.apiDataStore.pointTypes.fetchData()
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


input, select, textarea {
    width: 100%;
    padding: 10px 35px 10px 15px;
    border-radius: 20px;
    border: 1px solid var(--text-gray);
    margin-bottom: 2px;
    font-size: 15px;
    font-family: 'Sui Generis';
    border: none;
    outline: none;
    color: white;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    background-color: var(--bg-light);
}

select {
    background: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.66663 5.33337L8.00001 8.66671L11.3333 5.33337' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A") no-repeat;
    background-position: calc(100% - 15px) center !important;
    background-color: var(--bg-light);
}

textarea {
    resize: vertical;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><path fill="grey" d="M 4 4 L 28 4 L 28 28 L 4 28 Z M 6 6 L 26 6 L 26 26 L 6 26 Z M 8 8 L 24 8 L 24 24 L 8 24 Z"/></svg>');
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: 15px;
    background-color: var(--bg-light);
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

    margin: 0 auto;
    margin-top: 20px;
}

button.success {
    background-color: green;
}

p.success {
    text-align: center;
    color: green;
}

p {
    text-align: center;
}
</style>