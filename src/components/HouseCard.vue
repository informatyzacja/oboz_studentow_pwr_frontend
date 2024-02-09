<script setup>

import domekIcon from '../assets/icons8-exterior.png'

import moment from 'moment'

import rightArrow from '../assets/arrow.svg'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

defineProps({
    house: {
        type: Object,
        required: true
    },
    noArrow: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <div class="house-item">
        <div class="header">
            <img :src="domekIcon" alt="domek" />
            <div>
                <p class="name">Pokój nr {{ house.name }}</p>
                <p v-if="house.floor" class="floor">Piętro: {{ house.floor }}</p>
            </div>
        </div>

        <p class="places">Wolne miejsca: <span class="places-count">{{ house.places - house.locators }}/{{ house.places
        }}</span></p>

        <img v-if="!noArrow" :src="rightArrow" class="link_arrow" />

        <div v-if="house.description" class="description">
            <p>{{ house.description }}</p>
        </div>

        <div class="progress-info-container">
            <p class="progress-info" v-if="!isFreeForSignup && !youAreSigningUp">Ktoś właśnie się zapisuje</p>
            <p class="progress-info" v-else-if="!isFreeForSignup && youAreSigningUp">Właśnie się zapisujesz</p>
        </div>
        <div class="progress-bar">
            <div class="progress" :style="{ width: getProgress }"></div>

            <div class="progress progress-green" v-if="isFreeForSignup && freePlaces"></div>
            <p class="progress-text" v-if="isFreeForSignup && freePlaces && house.locators">WOLNE MIEJSCA</p>
            <p class="progress-text" v-else-if="isFreeForSignup && freePlaces">WOLNY</p>
            <p class="progress-text" v-else-if="freePlaces">{{ getSecondsLeft }}s</p>
            <p class="progress-text" v-else>Brak wolnych miejsc</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            timeLimit: 60,
            refreshKey: 0,
            refreshTimer: null
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
        freePlaces() {
            return this.house.locators < this.house.places
        },
        isFreeForSignup() {
            this.refreshKey
            return !this.house.housesignupprogress || this.timeLimit - (moment() - moment(this.house.housesignupprogress.last_updated)) / 1000 <= 0
        },
        youAreSigningUp() {
            return this.freePlaces && !this.isFreeForSignup && this.house.housesignupprogress && this.apiDataStore.profile.ready && this.house.housesignupprogress.user == this.apiDataStore.profile.data[0].id
        },
        getSecondsLeft() {
            if (this.isFreeForSignup) {
                return 0
            } else {
                return Math.round(this.timeLimit - (moment() - moment(this.house.housesignupprogress.last_updated)) / 1000)
            }
        },
        getProgress() {
            if (this.isFreeForSignup) {
                return 0
            } else {
                return 100 * this.getSecondsLeft / this.timeLimit + '%'
            }
        }
    },
    mounted() {
        this.refreshTimer = setInterval(() => {
            this.refreshKey++
        }, 200)
    },
    beforeUnmount() {
        clearInterval(this.refreshTimer)
    }
}
</script>

<style scoped>
.house-item {
    /* width: calc(50% - 10px); */
    height: 100%;
    /* aspect-ratio: 4/3; */
    background-color: var(--bg-lighter);
    border-radius: 15px;
    padding: 10px;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}

.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.header img {
    width: 30px;
    height: 30px;
}

.name {
    font-size: 1rem;
    font-weight: 600;
}

.floor {
    font-size: .7rem;
    font-weight: 300;
    opacity: .7;
    margin: 0;
    margin-top: -3px;
}

.places {
    font-size: .8rem;
    font-weight: 300;
    text-align: center;
    padding: 0 8px;
}

.places-count {
    font-weight: 600;
    font-size: 1rem;
    opacity: 1;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background-color: var(--bg-light);
    border-radius: 10px;
    margin-top: 10px;
    overflow: hidden;
    position: relative;
}

.progress {
    height: 100%;
    background-color: var(--theme-dark);
    border-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    transition: width .2s ease-out;
}

.progress-green {
    width: 100%;
    background-color: #18751880;
}

.progress-text {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .7rem;
    font-weight: 300;
    opacity: .7;
    padding: 0 5px;
}

.progress-info-container {
    width: 100%;
    height: 3px;
    border-radius: 10px;
    margin-top: 8px;
    position: relative;
}

.progress-info {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .65rem;
    font-weight: 300;
    opacity: .7;
    padding: 0 5px;
    left: 0;
    top: 0;
}

.link_arrow {
    width: 7px;
    height: calc(100% - 7px);
    right: 10px;
    position: absolute;
    top: 0;
}

.description {
    font-size: .8rem;
    font-weight: 300;
    text-align: center;
    padding: 0 8px;
    margin-top: 4px;
}
</style>