<script setup>
import TopBar from '../components/navigation/TopBar.vue';
import ItemBox from '../components/ItemBox.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import QrcodeStream from 'vue-qrcode-reader/src/components/QrcodeStream.vue'
import moment from 'moment';

import { API_URL, AUTH_HEADER } from '../config.js'
import { getCookie } from '../stores/functions.js'
</script>

<template>
    <TopBar title="Walidacja posiłków" backLink="/skaner"/>

    <div class="padding">
        <!-- <h3>Tryb skanowania</h3>
        <ItemBox bigText="Walidacja posiłków" small/> -->
        <!-- <h3>Posiłek</h3> -->
        <ItemBox :bigText="currentMealLoadng ? 'Ładowanie...' : (currentMeal ? currentMeal.type__name + ', ' + moment(currentMeal.date).format('dddd DD.MM') : 'Obecnie nie odbywa się żaden posiłek')" small/>

        <div class="center">
            <input type="number" maxLength="5" placeholder="Wpisz kod" class="search" v-model="searchQuery" @input="event => {if (event.target.value.length > event.target.maxLength)  event.target.value = event.target.value.slice(0, event.target.maxLength);}"/>
            <button class="button success" @click="search" v-if="searchQuery != '' && !currentMealLoadng && currentMeal">Sprawdź</button>

            <div class="scanner">
                <p class="error">{{ qrReaderError }}</p>
                <div class="scanner-inside" :class="{ hidden: qrScannerLoading || currentMealLoadng || !currentMeal }">
                    <QrcodeStream @decode="onDecode" @init="onInit" :track="track"/>
                </div>
                <LoadingIndicator v-if="qrScannerLoading" inline />
            </div>

            <div class="result" :class="{error: success===false, success: success===true}">
                <p v-if="result">Kod: {{ result }}</p>
                <h4>{{ user }}</h4>
                <h5 v-if="user_title">{{ user_title }}</h5>
                <h6 v-if="user_diet">Dieta: {{ user_diet }}</h6>
                <h5>{{ error }}</h5>
                <LoadingIndicator v-if="resultLoading" inline small/>
                <button class="button" v-if="validationCheckSuccessful && !validationSuccessful && !resultLoading" @click="validateMeal">Zatwierdź</button>
            </div>
        </div>  
    </div>
</template>

<script>
export default {
    components: {
        QrcodeStream
    },
    mounted() {
        this.getCurrentMeal()
    },
    data() {
        return {
            searchQuery: '',
            qrReaderError: '',
            result: '',
            originalResult: '',

            qrScannerLoading: true,
            resultLoading: false,

            user: '',
            error: '',
            success: null,
            user_title: '',
            user_diet: '',

            validationCheckSuccessful: null,
            validationSuccessful: null,

            currentMealLoadng: true,
            currentMeal: null,

        }
    },
    methods: {
        isNumeric(str) {
            if (typeof str != "string") return false // we only process strings!  
            return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
        },
        onDecode(result) {
            if (result === "") return;
            if (this.currentMealLoadng) return;
            this.originalResult = result
            this.result = result.substring(result.lastIndexOf('/') + 1)
            if (this.result.length > 5 || !this.isNumeric(this.result)) {
                this.result = '';
                this.error = "Błędny kod"
                return
            }
            this.checkMealValidation({user_id: this.result, meal_id: this.currentMeal.id})
        },
        search() {
            if (this.currentMealLoadng) return;
            this.result = this.searchQuery
            this.checkMealValidation({user_id: this.result, meal_id: this.currentMeal.id})
            this.searchQuery = ''
        },

        checkMealValidation(body) {
            this.loading = true
            this.resultLoading = true;
            this.user = '';
            this.error = '';
            this.success = null;
            this.validationSuccessful = null;
            this.validationCheckSuccessful = null;
            fetch(API_URL + "../staff-api/meal-validation/check/?" + new URLSearchParams(body), {
                headers: AUTH_HEADER,
                method: 'GET'
            })
                .then((data) => {
                    if (data.ok) {
                        return data.json()
                    }
                    this.error = data.status + " " + data.statusText
                    this.success = false
                    throw new Error('Request failed!')
                })
                .then((data) => {
                    this.success = data.success
                    this.validationCheckSuccessful = data.success
                    this.error = data.error
                    this.user = data.user
                    this.user_title = data.user_title
                    this.user_diet = data.user_diet
                })
                .catch((error) => {
                    console.error('There was an error!', error)
                })
                .finally(() => {
                    this.resultLoading = false
                })
        },

        validateMeal() {
            this.loading = true
            const csrftoken = getCookie('csrftoken');
            this.resultLoading = true;
            const body = {user_id: this.result, meal_id: this.currentMeal.id}
            fetch(API_URL + "../staff-api/meal-validation/validate/", {
                headers: Object.assign({}, { 'Content-type': 'application/json; charset=UTF-8', 'X-CSRFToken': csrftoken }, AUTH_HEADER),
                method: 'PUT',
                body: JSON.stringify(body)
            })
                .then((data) => {
                    if (data.ok) {
                        return data.json()
                    }
                    this.error = data.status + " " + data.statusText
                    this.success = false
                    throw new Error('Request failed!')
                })
                .then((data) => {
                    this.success = data.success
                    this.validationSuccessful = data.success
                    this.error = data.error
                    if (this.success ) {
                        this.error = "Zatwierdzono"
                    }
                    this.user = data.user
                    this.user_title = data.user_title
                    this.user_diet = data.user_diet
                })
                .catch((error) => {
                    console.error('There was an error!', error)
                })
                .finally(() => {
                    this.resultLoading = false
                })
        },
        
        getCurrentMeal() {
            fetch(API_URL + "../staff-api/meal-validation/current-meal/", {
                headers: AUTH_HEADER,
                method: 'GET'
            })
            .then((data) => {
                if (data.ok) {
                    try {
                        return data.json()
                    } catch (error) {
                        return null
                    }
                }
                throw new Error('Request failed!')
            })
            .then((data) => {
                this.currentMeal = data
            })
            .catch((error) => {
                console.error('There was an error!', error)
            })
            .finally(() => {
                this.currentMealLoadng = false
            })
        },


        

        async onInit (promise) {
            try {
                await promise
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                this.error = "ERROR: musisz dać pozwolenie na dostęp do kamery"
                } else if (error.name === 'NotFoundError') {
                this.error = "ERROR: brak kamery w tym urządzeniu"
                } else if (error.name === 'NotSupportedError') {
                this.error = "ERROR: potrzebujesz HTTPS"
                } else if (error.name === 'NotReadableError') {
                this.error = "ERROR: Nie można uzyskać dostępu do kamery. Być może jest ona już używana"
                } else if (error.name === 'OverconstrainedError') {
                this.error = "ERROR: Twój sprzęt nie obsługuje wymaganych rozdzielczości"
                } else if (error.name === 'StreamApiNotSupportedError') {
                this.error = "ERROR: Stream API nie jest obsługiwane w tej przeglądarce"
                } else if (error.name === 'InsecureContextError') {
                this.error = 'ERROR: Nie można uzyskać dostępu do kamery z niezabezpieczonej strony';
                } else {
                this.error = `ERROR: Error kamery (${error.name})`;
                }
            } finally {
                this.qrScannerLoading = false
            }
        },
        track(detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const [ firstPoint, ...otherPoints ] = detectedCode.cornerPoints


                //outline
                const gradient = ctx.createLinearGradient(0, 0, 200, 0);
                gradient.addColorStop("0", "#de7539");
                gradient.addColorStop("1.0", "#dea766");

                // ctx.strokeStyle = "#de7539";
                ctx.strokeStyle = this.resultLoading || this.originalResult!=detectedCode.rawValue ? "gray" : (this.success ? "green" : 'red');
                ctx.lineWidth = 10;          

                ctx.beginPath();
                ctx.moveTo(firstPoint.x, firstPoint.y);
                for (const { x, y } of otherPoints) {
                ctx.lineTo(x, y);
                }
                ctx.lineTo(firstPoint.x, firstPoint.y);
                ctx.closePath();
                ctx.stroke();


                //text
                const { boundingBox } = detectedCode

                const centerX = boundingBox.x + boundingBox.width/ 2
                const centerY = boundingBox.y + boundingBox.height/ 2

                const fontSize = Math.max(12, 55 * boundingBox.width/ctx.canvas.width)

                ctx.font = `bold ${fontSize}px sans-serif`
                ctx.textAlign = "center"

                const value = !this.resultLoading ? this.user || this.error : 'Ładowanie...'

                ctx.lineWidth = 3
                ctx.strokeStyle = 'white'
                ctx.strokeText(value, centerX, centerY)

                ctx.fillStyle = 'black'
                ctx.fillText(value, centerX, centerY)
            }
        },



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
.search {
    width: 50%;
    padding: 20px;
    border-radius: 20px;
    border: 1px solid var(--color-border);
    margin-top: 10px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 20px;
    font-family: 'Sui Generis';
    background-color: var(--bg-light);
    color: white;
    outline: none;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.scanner {
    width: 80vw;
    height: 80vw;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.scanner-inside {
    width: 100%;
    height: 100%;
}

.button {
  border-radius: 20px;
  border: none;
  color: white;
  padding: 20px 35px;
  font-size: 17px;
  line-height: 16px;
  cursor: pointer;
  font-family: 'Sui Generis';

  display: flex;
  justify-content: center;

  margin-bottom: 12px;

  background-color: var(--bg-light);
}

.result {
    background-color: var(--bg-light);
    width: 95%;
    min-height: 100px;
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 20px;
    color: white;
    font-size: 23px;
    margin: 10px;
    text-align: center;
}

.result h5 {
    font-size: 17px;
    color: #bbb;
}
.result h6 {
    font-size: 16px;
}

.result p {
    font-size: 15px;
}
.error {
    background-color: var(--red);
}
.success {
    background-color: green;
}



</style>