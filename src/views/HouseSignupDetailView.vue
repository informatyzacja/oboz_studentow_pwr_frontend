<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores, mapState } from 'pinia'

import moment from 'moment'

import HouseCard from '../components/HouseCard.vue'

import { apiRequest } from '../stores/functions.js'

import OverlayView from '../components/OverlayView.vue'
import cryingIcon from '../assets/icons8-crying.png'

import { IonPage, IonContent, toastController } from '@ionic/vue';
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar
                    :title="(apiDataStore.houseSignupsInfo.ready &&
                        apiDataStore.houseSignupsInfo.data.room_instead_of_house ? 'Pokój' : 'Domek') + (house ? ' nr ' + house.name : '')"
                    :backLink="$router.options.history.state.back || '/zapisy'" />

                <p v-if="apiDataStore.houses.ready && !house && apiDataStore.houseSignupsInfo.ready && apiDataStore.houseSignupsInfo.data.house_signups_active"
                    style="text-align: center;">Nie znaleziono domku/pokoju</p>

                <OverlayView ref="leaveHouseOverlay">
                    <div class="padding leave-house-overlay" v-if="house.signout_open">

                        <p>Czy napewno chcesz się wypisać z tego {{ apiDataStore.houseSignupsInfo.ready &&
                            apiDataStore.houseSignupsInfo.data.room_instead_of_house ? 'pokoju' : 'domku' }}? Jeżeli się
                            wypiszesz ktoś inny będzie mógł
                            zająć Twoje
                            miejsce.</p>

                        <div>
                            <button class="button error" @click="leaveHouse" v-if="youAreSignedUpForThisHouse">Wypisz
                                się</button>

                            <button class="button" @click="$refs.leaveHouseOverlay.hide">Anuluj</button>
                        </div>
                    </div>

                    <div class="padding leave-house-overlay" v-else>

                        <p>Wypisywanie się z tego {{ apiDataStore.houseSignupsInfo.ready &&
                            apiDataStore.houseSignupsInfo.data.room_instead_of_house ? 'pokoju' : 'domku' }} jest
                            zablokowane.</p>

                        <div>
                            <button class="button" @click="$refs.leaveHouseOverlay.hide">OK</button>
                        </div>
                    </div>
                </OverlayView>

                <div
                    v-if="house && apiDataStore.houseSignupsInfo.ready && apiDataStore.houseSignupsInfo.data.house_signups_active">

                    <div class="my-house">
                        <HouseCard :house="house" noArrow />
                    </div>

                    <!-- <button class="button success start-signup-button" @click="startSignup"
                v-if="freePlaces && isFreeForSignup && !youAreSigningUp && apiDataStore.profile.ready && apiDataStore.profile.data[0].house && apiDataStore.profile.data[0].house.id == $route.params.id">Kontynuuj
                zapisywanie</button> -->

                    <div class="signup">
                        <div class="person" v-if="youDontHaveAHouseOrYouAreSignedUpForThisHouse">
                            <div class="index">1.</div>
                            <div class="names">
                                <input type="text" placeholder="Imię i Nazwisko"
                                    :value="apiDataStore.profile.data[0].first_name + ' ' + apiDataStore.profile.data[0].last_name"
                                    disabled />
                            </div>
                            <!-- <input class="bandInput" placeholder="ID" :value="apiDataStore.profile.data[0].bandId" disabled /> -->

                            <button class="button error" @click="$refs.leaveHouseOverlay.show"
                                v-if="youAreSignedUpForThisHouse" :class="{ 'disabled': !house.signout_open }">Wypisz
                                się</button>
                            <button class="button success" @click="signupSelf"
                                v-else-if="!apiDataStore.profile.data[0].house">Zapisz
                                się</button>
                        </div>
                        <p v-else class="info">Jeżeli chcesz się zapisać do tego {{ apiDataStore.houseSignupsInfo.ready
                            &&
                            apiDataStore.houseSignupsInfo.data.room_instead_of_house ? 'pokoju' : 'domku' }}, najpierw
                            wypisz się z {{ apiDataStore.houseSignupsInfo.ready &&
                                apiDataStore.houseSignupsInfo.data.room_instead_of_house ? 'pokoju' : 'domku' }},
                            do którego
                            jesteś
                            obecnie zapisany/a.</p>
                        <div class="person" v-for="(person, index) in people" :key="index">
                            <div class="index">{{ index + 1 + indexOffset }}.</div>
                            <!-- <div>
                        <input type="text" v-model="person.first_name" placeholder="ID" :disabled="signupLoading" />
                    </div> -->
                            <div v-if="person.first_name" class="names">
                                <input type="text" placeholder="Imię i Nazwisko"
                                    :value="person.first_name + ' ' + person.last_name" disabled />
                            </div>
                            <input v-else type="number" pattern="[0-9]*" inputmode="numeric" class="bandInput"
                                v-model="person.band" placeholder="Nr opaski"
                                :disabled="signupLoading || person.first_name || !((isFreeForSignup || youAreSigningUp) && youAreSignedUpForThisHouse)"
                                maxlength="6" />
                            <button class="button success" @click="signupPerson(person)"
                                v-if="!person.first_name && (isFreeForSignup || youAreSigningUp) && youAreSignedUpForThisHouse">Zapisz</button>
                        </div>
                        <LoadingIndicator v-if="signupLoading" inline />
                    </div>
                </div>
                <div class="padding info-screen"
                    v-else-if="apiDataStore.houseSignupsInfo.ready && !apiDataStore.houseSignupsInfo.data.house_signups_active">
                    <h3>Zapisy zamknięte!</h3>
                    <img :src="cryingIcon" alt="crying" style="width: 100px; margin: 20px auto; display: block;" />
                    <p>Przepraszamy, ale zapisy na {{ apiDataStore.houseSignupsInfo.data.room_instead_of_house ?
                        'pokoje' : 'domki'
                        }} są
                        zamknięte.</p>

                    <RouterLink to="/">
                        <button class="button" style="margin-top: 20px">Wyjdź</button>
                    </RouterLink>
                </div>
                <LoadingIndicator v-if="apiDataStore.houses.loading || apiDataStore.profile.loading" />
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return {
            people: [],


            signupLoading: false,

            refreshTimer: null,
            refreshKey: 0,
            houseRefreshKey: 0,
            timeLimit: 60,
            id: this.$route.params.id
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
        ...mapState(useApiDataStore, ['houses']),

        house() {
            this.houseRefreshKey;
            return this.apiDataStore.houses.houseWithId(this.id)
        },
        freePlaces() {
            return this.house.locators < this.house.places
        },
        isFreeForSignup() {
            this.refreshKey
            return this.house && !this.house.housesignupprogress || this.timeLimit - (moment() - moment(this.house.housesignupprogress.last_updated)) / 1000 <= 0
        },
        youAreSigningUp() {
            return this.house && this.freePlaces && !this.isFreeForSignup && this.house.housesignupprogress && this.apiDataStore.profile.ready && this.house.housesignupprogress.user == this.apiDataStore.profile.data[0].id
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
        },
        youAreSignedUpForThisHouse() {
            return this.apiDataStore.profile.ready && this.apiDataStore.profile.data[0].house && this.$route.params.id == this.apiDataStore.profile.data[0].house.id
        },
        indexOffset() {
            return this.youDontHaveAHouseOrYouAreSignedUpForThisHouse ? 1 : 0
        },
        youDontHaveAHouseOrYouAreSignedUpForThisHouse() {
            return this.apiDataStore.profile.ready && (!this.apiDataStore.profile.data[0].house || this.$route.params.id == this.apiDataStore.profile.data[0].house.id)
        }
    },
    watch: {
        houses: {
            handler() {
                this.houseRefreshKey++
                this.createPeople()
            },
            deep: true
        }
    },
    mounted() {
        this.apiDataStore.houseSignupsInfo.fetchData()
        this.refreshTimer = setInterval(() => {
            this.refreshKey++
        }, 200)

        this.apiDataStore.houses.fetchData()
        this.apiDataStore.profile.fetchData()
        this.apiDataStore.houseSignups.connect()

        this.createPeople()
    },
    beforeUnmount() {
        clearInterval(this.refreshTimer)

        // disconnect from the websocket if not leaving for the all houses view
        if (this.$route.name !== 'zapisy-na-domki') {
            this.apiDataStore.houseSignups.disconnect()
        }
    },
    methods: {
        createPeople() {
            while (this.house && this.people.length + this.indexOffset < this.house.places) this.people.push({ band: '' })
            this.updatePeople()
        },
        updatePeople() {
            if (!this.house) return
            const locators_data = this.house.locators_data
            if (!locators_data || !this.apiDataStore.profile.ready) return

            // update people
            locators_data.forEach((locator) => {
                if (this.apiDataStore.profile.data[0].bandId === locator.bandId) {
                    if (!this.apiDataStore.profile.data[0].house || this.apiDataStore.profile.data[0].house.id !== this.house.id) {
                        this.apiDataStore.profile.fetchData()
                    }
                    return
                }
                var person = this.people.find((person) => person.band == locator.bandId)
                if (person) {
                    person.first_name = locator.first_name
                    person.last_name = locator.last_name
                } else {
                    // first person with empty band
                    person = this.people.find((person) => person.band == '')
                    if (locator) {
                        person.first_name = locator.first_name
                        person.last_name = locator.last_name
                        person.band = locator.bandId
                    }
                }
            })

            // remove people
            this.people.forEach((person) => {
                if (!locators_data.find((locator) => locator.bandId == person.band)) {
                    person.first_name = null
                    person.last_name = null
                    person.band = ''
                }
            })
        },
        leaveHouse() {
            this.$refs.leaveHouseOverlay.hide();

            this.signupLoading = true
            apiRequest('../api2/leave-house/', 'PUT')
                .then((data) => {
                    this.success = data.success
                    if (data.error) {
                        toastController.create({
                            message: data.error,
                            duration: 2000,
                            color: 'danger',
                            position: 'top'
                        }).then(toast => toast.present())
                    }
                })
                .catch((error) => {
                    console.error('There was an error!', error)
                    toastController.create({
                        message: "Błąd",
                        duration: 2000,
                        color: 'danger',
                        position: 'top'
                    }).then(toast => toast.present())
                })
                .finally(() => {
                    this.signupLoading = false
                    this.apiDataStore.profile.fetchData()
                    // this.apiDataStore.houses.fetchData()
                })
        },
        signupPerson(person) {
            if (!person || !person.band) {
                toastController.create({
                    message: 'Nie podano ID użytkownika',
                    duration: 2000,
                    color: 'danger',
                    position: 'top'
                }).then(toast => toast.present())
                return
            }
            this.signup(person.band)
        },
        signupSelf() {
            this.signup()
        },
        signup(bandId) {
            this.signupLoading = true
            const body = {
                bandId: bandId,
            }
            apiRequest('../api2/signup-user-for-house/' + this.$route.params.id + '/',
                'PUT',
                body
            )
                .then((data) => {
                    this.success = data.success
                    if (data.error) {
                        toastController.create({
                            message: data.error,
                            duration: 2000,
                            color: 'danger',
                            position: 'top'
                        }).then(toast => toast.present())
                    }
                })
                .catch((error) => {
                    console.error('There was an error!', error)
                    toastController.create({
                        message: "Błąd",
                        duration: 2000,
                        color: 'danger',
                        position: 'top'
                    }).then(toast => toast.present())
                })
                .finally(() => {
                    this.signupLoading = false
                    this.apiDataStore.profile.fetchData()
                    // this.apiDataStore.houses.fetchData()
                })
        }
    }
}

</script>

<style scoped>
.leave-house-overlay {
    padding: 20px;
    padding-bottom: 20px;
    margin: 20px auto;
    width: 95%;
    background: var(--bg-lighter);
    border-radius: 28px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
}

.leave-house-overlay>div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.names {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;

}

.info {
    color: var(--text-dark);
    font-size: .8rem;
    text-align: center;
    margin: 5px 30px;
    margin-bottom: 15px;
}

.signup {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.person {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    gap: 5px;
    padding: 0 15px;
}

input,
select,
textarea {
    width: 100%;
    padding: 10px 15px 10px 15px;
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

input::placeholder {
    color: rgba(255, 255, 255, 0.5)
}

.bandInput {
    width: 120px;
}


button.success {
    background-color: green;
}

button.error {
    background-color: darkred;
}

.start-signup-button {
    margin: 10px auto;
}

.my-house {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
}

.my-house>* {
    width: calc(70% - 10px);
}

/* info screen */
.info-screen {
    text-align: center;
}

.info-screen h3 {
    font-size: 25px;
    margin-bottom: 20px;
}

.info-screen p {
    color: var(--text-gray);
}

.info-screen p a {
    color: var(--theme-dark)
}

button {
    border-radius: 20px;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;

    background-color: var(--bg-light-translusent);

    /* width: 100px; */
    display: flex;
    justify-content: center;

    /* margin: 0 auto; */
    /* margin-top: 20px; */
}

button:disabled,
button.disabled {
    background-color: var(--bg-lighter);
    color: var(--text-gray);
    cursor: not-allowed;
}
</style>