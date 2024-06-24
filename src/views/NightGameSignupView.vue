<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import TextBox from '../components/TextBox.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { apiRequest } from '../stores/functions.js'

import okIcon from '../assets/icons8-ok.png'
import cryingIcon from '../assets/icons8-crying.png'

// import moment from 'moment'
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>

    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar title="Zapisy na grę nocną" :backLink="$router.options.history.state.back || '/'" />

                <div class="padding-main"
                    v-if="apiDataStore.nightGameGroupInfo.ready && !success && apiDataStore.nightGameGroupInfo.data.free_places && !apiDataStore.nightGameGroupInfo.data.user_in_group && apiDataStore.nightGameGroupInfo.data.night_game_signup_active">

                    <TextBox>
                        <p>UWAGA! Zapisy wykonuje tylko jedna osoba z grupy.</p>
                        <p>Dla fajnieszej zabawy polecamy, aby w grupie znalazły się zarówno <span
                                class="bold">chłopacy, jak i
                                dziewczyny</span>.</p>

                        <!-- <p>Wszystkie osoby w grupie muszą mieć <span class="bold">ukończone 18 lat</span> w dniu
                            gry<span
                                v-if="apiDataStore.nightGameGroupInfo.ready && apiDataStore.nightGameGroupInfo.data.night_game_date">
                                ({{ moment(apiDataStore.nightGameGroupInfo.data.night_game_date).format('DD.MM.YYYY')
                                }})</span>.
                        </p> -->

                        <div class="spacer"></div>

                        <p
                            v-if="apiDataStore.nightGameGroupInfo.data.group_user_min === apiDataStore.nightGameGroupInfo.data.group_user_max">
                            Grupa musi liczyć dokładnie <span class="bold">{{
                                apiDataStore.nightGameGroupInfo.data.group_user_min }}
                                osób</span>.
                        </p>
                        <p v-else>Liczba osób w grupie: {{ apiDataStore.nightGameGroupInfo.data.group_user_min }} - {{
                            apiDataStore.nightGameGroupInfo.data.group_user_max }} </p>
                    </TextBox>

                    <h3 style="margin-top:10px"> Nazwa grupy </h3>
                    <input type="text" v-model="groupName" />

                    <div v-if="groupSize !== ''">
                        <h3>Osoby</h3>
                        <div class="person" v-if="apiDataStore.profile.ready">
                            <div class="index">1.</div>
                            <div>
                                <input type="text" placeholder="Imię" :value="apiDataStore.profile.data[0].first_name"
                                    disabled />
                            </div>
                            <input type="number" pattern="[0-9]*" inputmode="numeric" class="bandInput"
                                placeholder="Nr opaski" :value="apiDataStore.profile.data[0].bandId" disabled />
                        </div>
                        <LoadingIndicator v-else inline small />

                        <div class="person" v-for="(person, index) in people" :key="index">
                            <div class="index">{{ index + 2 }}.</div>
                            <div>
                                <input type="text" v-model="person.first_name" placeholder="Imię"
                                    :disabled="signupLoading" />
                            </div>
                            <input type="text" pattern="[0-9]*" inputmode="numeric" class="bandInput"
                                v-model="person.band" placeholder="Nr opaski" :disabled="signupLoading" maxlength="6" />
                        </div>
                    </div>

                    <div class="change-group-size-buttons">
                        <button class="button" v-if="groupSize < apiDataStore.nightGameGroupInfo.data.group_user_max"
                            @click="groupSize++">Dodaj osobę</button>
                        <button class="button" v-if="groupSize > apiDataStore.nightGameGroupInfo.data.group_user_min"
                            @click="groupSize--">Usuń osobę</button>
                    </div>

                    <p class="error">{{ apiDataStore.nightGameGroupInfo.error }}</p>
                    <p class="error">{{ error }}</p>
                    <p class="error">{{ peopleError }}</p>

                    <div
                        v-if="groupName && groupSize >= apiDataStore.nightGameGroupInfo.data.group_user_min && groupSize <= apiDataStore.nightGameGroupInfo.data.group_user_max && !apiDataStore.nightGameGroupInfo.loading && !success && !signupLoading && peopleValid()">
                        <button class="button success" style="margin-top: 30px" @click="signupGroup">Zapisz
                            grupę</button>
                        <!-- <h3 style="margin-top: 5px;text-align: center;">Upewnij się, że wpisane imiona są takie same jak
                            imię
                            wyświetlające się w zakładce "profil" każdego uczestnika</h3> -->
                    </div>
                    <LoadingIndicator v-if="signupLoading" inline />
                </div>

                <div class="padding info-screen" v-if="success">
                    <h3>Gratulacje!</h3>
                    <img :src="okIcon" alt="ok" style="width: 100px; margin: 20px auto; display: block;" />
                    <p>Twoja grupa została zapisana na grę nocną.</p>
                    <p>W razie problemów prosimy o natychmiastowy kontakt ze sztabem.</p>
                    <p>Do zobaczenia na grze!</p>

                    <p style="margin-top: 20px">Grupę możesz zobaczyć w zakładce <RouterLink to="/profil"><u>profil</u>
                        </RouterLink>
                        .</p>
                </div>

                <div class="padding info-screen"
                    v-if="apiDataStore.nightGameGroupInfo.ready && !apiDataStore.nightGameGroupInfo.data.free_places && !apiDataStore.nightGameGroupInfo.data.user_in_group">
                    <h3>Brak miejsc!</h3>
                    <img :src="cryingIcon" alt="crying" style="width: 100px; margin: 20px auto; display: block;" />
                    <p>Przepraszamy, ale miejsca na grę nocną już się skończyły.</p>

                    <RouterLink :to="$router.options.history.state.back || '/'">
                        <button class="button" style="margin-top: 20px">Wróć</button>
                    </RouterLink>
                </div>

                <div class="padding info-screen"
                    v-else-if="apiDataStore.nightGameGroupInfo.ready && !apiDataStore.nightGameGroupInfo.data.night_game_signup_active && !apiDataStore.nightGameGroupInfo.data.user_in_group">
                    <h3>Zapisy zamknięte!</h3>
                    <img :src="cryingIcon" alt="crying" style="width: 100px; margin: 20px auto; display: block;" />
                    <p>Przepraszamy, ale zapisy na grę nocną są zamknięte.</p>

                    <RouterLink :to="$router.options.history.state.back || '/'">
                        <button class="button" style="margin-top: 20px">Wróć</button>
                    </RouterLink>
                </div>

                <div class="padding info-screen"
                    v-else-if="apiDataStore.nightGameGroupInfo.ready && apiDataStore.nightGameGroupInfo.data.user_in_group">
                    <h3>Już jesteś zapisany na grę nocną</h3>
                    <img :src="okIcon" alt="ok" style="width: 100px; margin: 20px auto; display: block;" />
                    <p>Już jesteś zapisany na grę nocną.</p>

                    <p style="margin-top: 20px">Grupę możesz zobaczyć w zakładce <RouterLink to="/profil"><u>profil</u>
                        </RouterLink>
                        .</p>
                </div>


                <LoadingIndicator v-if="apiDataStore.nightGameGroupInfo.loading" />
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return {
            groupName: '',
            groupSize: 1,
            people: [],

            error: '',
            peopleError: '',

            signupLoading: false,
            success: false,

            timer: null
        }
    },
    computed: {
        ...mapStores(useApiDataStore),
    },
    watch: {
        groupSize() {
            if (this.groupSize > this.apiDataStore.nightGameGroupInfo.data.group_user_max) this.groupSize = this.apiDataStore.nightGameGroupInfo.data.group_user_max
            if (this.people.length >= this.groupSize) this.people = this.people.slice(0, this.groupSize - 1)
            this.createPeople()
        }
    },
    methods: {
        createPeople() {
            while (this.people.length + 1 < this.groupSize) this.people.push({ first_name: '', band: '' })
        },
        peopleValid() {
            for (let person of this.people) {
                if (!person.first_name || !person.band) {
                    this.peopleError = ''
                    return false
                }
                if (person.band.length > 6) {
                    this.peopleError = 'Numer opaski jest za długi'
                    return false
                }

                if (this.apiDataStore.profile.ready && this.apiDataStore.profile.data[0].bandId == person.band) {
                    this.peopleError = 'Dwie osoby mają ten sam numer opaski'
                    return false
                }

                for (let person2 of this.people) {
                    if (person2 !== person && person2.band === person.band) {
                        this.peopleError = 'Dwie osoby mają ten sam numer opaski'
                        return false
                    }
                }
            }
            this.peopleError = ''
            return true
        },


        signupGroup() {
            this.signupLoading = true
            const body = {
                group_name: this.groupName,
                people: this.people,
            }
            apiRequest('../api2/signup-group/', 'POST', body)
                .then((data) => {
                    this.success = data.success
                    this.error = data.error
                    console.log(this.error)

                    if (data.error_code === 1) {
                        this.apiDataStore.nightGameGroupInfo.data.free_places = false
                    } else if (data.error_code === 6) {
                        this.apiDataStore.nightGameGroupInfo.data.user_in_group = true
                    }
                })
                .catch((error) => {
                    console.error('There was an error!', error)
                })
                .finally(() => {
                    this.signupLoading = false
                })
        }


    },
    mounted() {
        this.apiDataStore.nightGameGroupInfo.fetchData()

        if (this.apiDataStore.nightGameGroupInfo.ready && this.groupSize < this.apiDataStore.nightGameGroupInfo.data.group_user_min) {
            this.groupSize = this.apiDataStore.nightGameGroupInfo.data.group_user_min
        }
        this.createPeople()
        this.apiDataStore.profile.fetchData()

        this.timer = setInterval(this.apiDataStore.nightGameGroupInfo.fetchData, 30 * 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer)
    }
}
</script>

<style scoped>
input,
select,
textarea {
    width: 100%;
    padding: 10px 15px 10px 15px;
    border-radius: 20px;
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
    color: var(--text-gray);
}

.bandInput {
    width: 120px;
}

.index {
    width: 40px;
    text-align: center;
    font-size: 18px;
}

.person {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    gap: 5px;
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

    width: 160px;
    display: flex;
    justify-content: center;

    margin: 0 auto;
    margin-top: 20px;
}

button.success {
    background-color: green;
}

.change-group-size-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}


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

.bold {
    font-weight: bold;
}

.spacer {
    height: 15px;
}
</style>