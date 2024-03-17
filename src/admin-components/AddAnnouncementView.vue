<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { API_URL, AUTH_HEADER } from '../config.js'
import { getCookie } from '../stores/functions.js'

import moment from 'moment'
</script>

<template>
    <main>
    <TopBar title="Dodaj ogłoszenie" :backLink="$router.options.history.state.back || '/admin-menu'" />

    <div class="padding-main" v-if="apiDataStore.pointTypes.ready">
        <h3>Rodziaj grupy</h3>
        <select v-model="selectedGroupType"
            @input="event => { selectedGroup = ''; selectedPointType = ''; selectedGroupType = event.target.value }"
            :disabled="disabled"
            >
            <option value="all">Wszystkie</option>
            <option v-for="groupType in apiDataStore.pointTypes.data.groupTypes" :key="groupType.id" :value="groupType.name">
                {{ groupType.name }}
            </option>
        </select>

        <div  v-if="selectedGroupType!='all'">
            <h3>Grupa</h3>
            <select v-model="selectedGroup"
            :disabled="disabled"
            >
                <option disabled value="null">Wybierz grupę</option>
                <option v-for="group in apiDataStore.pointTypes.groupsWithGroupType(selectedGroupType)" :key="group.id" :value="group.id">
                    {{ group.name }}
                </option>
            </select>
        </div>
        
        <div v-if="selectedGroupType==='all' || selectedGroup">
            <h3>Tytuł ogłoszenia</h3>
            <input v-model="title" type="text" maxlength="100"
            :disabled="disabled" />
            
            <h3>Treść ogłoszenia</h3>
            <textarea v-model="content" rows="4" cols="50"
            :disabled="disabled"
            ></textarea>

            <h3>Do kiedy ogłoszenie ma być widoczne</h3>
            <input v-model="hide_date" type="datetime-local" :min="hide_date_min"
            :disabled="disabled" />

            <div class="sendNotif">
                <h3>Wyślij powiadomienia</h3>
                <input type="checkbox" v-model="sendNotif" :disabled="disabled"/>
            </div>

            <button class="button success" @click="addAnouncement" v-if="title && content && hide_date && !loading && !success">Dodaj ogłoszenie</button>

            <LoadingIndicator v-if="loading" />
            <p class="success">{{ info }}</p>
            <p v-if="error" class="error">{{ error }}</p>
        </div>



    </div>

    <LoadingIndicator v-if="apiDataStore.pointTypes.loading" />
    <p v-if="apiDataStore.pointTypes.error" class="error">{{ apiDataStore.pointTypes.error }}</p>
</main>
</template>


<script>
export default {
    data() {
        return {
            timer: null,
            selectedGroupType: 'all',
            selectedGroup: null,

            loading: false,
            error: null,
            success: null,
            info: '',

            title: '',
            content: '',
            hide_date: null,
            sendNotif: true,

            disabled: false,
            hide_date_min: null
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
    },
    watch: {
        selectedGroupType() {
            this.selectedGroup = null
        }
    },
    mounted() {
        this.hide_date_min = moment().format("YYYY-MM-DDTHH:mm")

        this.apiDataStore.pointTypes.fetchData()
        this.timer = setInterval(this.apiDataStore.pointTypes.fetchData, 300000)
    },
    methods: {
        addAnouncement() {
            if (this.apiDataStore.permissions.ready && this.apiDataStore.permissions.hasPermission('can_add_announcement')) {
                this.disabled = true
                this.loading = true;
                const csrftoken = getCookie('csrftoken')
                const data = {
                    groupId: this.selectedGroup,
                    title: this.title,
                    content: this.content,
                    sendNotif: this.sendNotif,
                    hide_date: this.hide_date
                }
                fetch(API_URL + '../staff-api/add-announcement/', {
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
                            window.location.href = '/login/?next=' + window.location.pathname
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
                        this.info = data.info
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


input, select, textarea {
    width: 100%;
    padding: 10px 35px 10px 15px;
    border-radius: 20px;
    border: 1px solid var(--text-gray);
    margin-bottom: 2px;
    font-size: 15px;
    
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

input[type=checkbox] {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    margin-left: 0;
    margin-bottom: 0;
    margin-top: 0;
    padding: 0;
    border-radius: 5px;
    border: none;
    background-color: var(--bg-light);
    position: relative;
}

input[type=checkbox]:checked {
    background-color: var(--theme-dark)
}

input[type=checkbox]:checked:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 5px;
    border: 2px solid white;
    border-top: none;
    border-right: none;
    top: 7px;
    left: 5px;
    transform: rotate(-45deg);
}

.sendNotif {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 10px 0;
    gap: 10px;
}

button {
    border-radius: 20px;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    
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

input::-webkit-calendar-picker-indicator {
    filter: invert(1);
}

</style>