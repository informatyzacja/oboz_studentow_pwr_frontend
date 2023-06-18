<script setup>
import TopBar from '../components/navigation/TopBar.vue';
import ItemBox from '../components/ItemBox.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import { QrcodeStream } from 'vue3-qrcode-reader'

import { API_URL, AUTH_HEADER } from '../config.js'
import { getCookie } from '../stores/functions.js'
</script>

<template>
    <TopBar title="Skaner"/>

    <div class="padding">
        <h3>Tryb skanowania</h3>
        <ItemBox bigText="Walidacja posiłków"/>

        <div class="center">
            <input type="text" placeholder="Wpisz kod" class="search" v-model="searchQuery"/>
            <button class="button" @click="search" v-if="searchQuery != ''">Zatwierdź</button>

            <div class="scanner">
                <p class="error">{{ qrReaderError }}</p>
                <div class="scanner-inside" :class="{ hidden: qrScannerLoading }">
                    <QrcodeStream @decode="onDecode" @init="onInit" :track="track"/>
                </div>
                <LoadingIndicator v-if="qrScannerLoading" inline />
            </div>

            <div class="result" :class="{error: !success}">
                <p v-if="result">Kod: {{ result }}</p>
                <h4>{{ user }}</h4>
                <h5>{{ error }}</h5>
                <LoadingIndicator v-if="resultLoading" inline />
            </div>
        </div>  
    </div>
</template>

<script>
export default {
    components: {
        QrcodeStream
    },
    data() {
        return {
            searchQuery: '',
            qrReaderError: '',
            result: '',

            qrScannerLoading: true,
            mealId: 1,
            resultLoading: false,

            user: '',
            error: '',
            success: true,
        }
    },
    methods: {
        onDecode(result) {
            if (result === "") return;
            this.result = result.substring(result.lastIndexOf('/') + 1)
            this.mealValidationApiCall({user_id: this.result, meal_id: this.mealId})
        },
        search() {
            this.result = this.searchQuery
            this.mealValidationApiCall({user_id: this.searchQuery, meal_id: this.mealId})
        },

        mealValidationApiCall(body) {
            this.loading = true
            const csrftoken = getCookie('csrftoken');
            this.resultLoading = true;
            this.user = '';
            this.error = '';
            this.success = true;
            fetch(API_URL + "../staff-api/validate-meal/", {
                headers: Object.assign({}, { 'Content-type': 'application/json; charset=UTF-8', 'X-CSRFToken': csrftoken }, AUTH_HEADER),
                method: 'PUT',
                body: JSON.stringify(body)
            })
                .then((data) => {
                    if (data.ok) {
                        return data.json()
                    }
                    throw new Error('Request failed!')
                })
                .then((data) => {
                    this.success = data.success
                    this.error = data.error
                    this.user = data.user
                    this.searchQuery = ''
                })
                    .catch((error) => {
                    console.error('There was an error!', error)
                })
                .finally(() => {
                    this.resultLoading = false
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
        track(detectedCode, ctx) {
            const [ firstPoint, ...otherPoints ] = [detectedCode.topLeftCorner, detectedCode.topRightCorner, detectedCode.bottomRightCorner, detectedCode.bottomLeftCorner]
            

            //outline
            const gradient = ctx.createLinearGradient(0, 0, 200, 0);
            gradient.addColorStop("0", "#de7539");
            gradient.addColorStop("1.0", "#dea766");

            // ctx.strokeStyle = "#de7539";
            ctx.strokeStyle = gradient;
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
            const centerX = (detectedCode.topLeftCorner.x + detectedCode.bottomRightCorner.x)/ 2
            const centerY = (detectedCode.topLeftCorner.y + detectedCode.bottomRightCorner.y)/ 2

            const fontSize = Math.max(12, 0.13 * (Math.abs(detectedCode.topLeftCorner.x - detectedCode.bottomRightCorner.x) + Math.abs(detectedCode.topLeftCorner.y - detectedCode.bottomRightCorner.y)))

            ctx.font = `bold ${fontSize}px sans-serif`
            ctx.textAlign = "center"

            const value = !this.resultLoading ? this.user : 'Ładowanie...'

            ctx.lineWidth = 3
            ctx.strokeStyle = 'white'
            ctx.strokeText(value, centerX, centerY)

            ctx.fillStyle = 'black'
            ctx.fillText(value, centerX, centerY)
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
  background-color: green;

  display: flex;
  justify-content: center;

  margin-bottom: 12px;
}

.result {
    background-color: green;
    width: 95%;
    min-height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 20px;
    color: white;
    font-size: 23px;
    margin: 10px;
}

.result h5 {
    font-size: 17px;
    color: #bbb;
}

.result.error {
    background-color: var(--red);
}



</style>