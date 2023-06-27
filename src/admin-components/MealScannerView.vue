<script setup>
import TopBar from '../components/navigation/TopBar.vue';
import ItemBox from '../components/ItemBox.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import ScannerBaseView from './ScannerBaseView.vue';
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
            <ScannerBaseView 
            @error="(err) => error=err" 
            @result="(res) => {result=res; checkMealValidation()}" :hideScanner="currentMealLoadng || !currentMeal"
            :codeText="!resultLoading ? user || error : 'Ładowanie...'"
            :codeFrameColor="resultLoading ? 'gray' : (success ? 'green' : '#9a2929') "
             />
            

            <div class="result" :class="{error: success===false, success: success===true}" v-if="result || user || error || resultLoading || (validationCheckSuccessful && !validationSuccessful && !resultLoading)" >
                <p v-if="result">Kod: {{ result }}</p>
                <h4>{{ user }}</h4>
                <h5 v-if="user_title">{{ user_title }}</h5>
                <h6 v-if="user_diet">Dieta: {{ user_diet }}</h6>
                <h5>{{ error }}</h5>
                <LoadingIndicator v-if="resultLoading" inline small/>
                <button class="button success" v-if="validationCheckSuccessful && !validationSuccessful && !resultLoading" @click="validateMeal">Zatwierdź</button>
            </div>
        </div>  
    </div>
</template>

<script>
export default {
    mounted() {
        this.getCurrentMeal()
    },
    data() {
        return {
            result: '',

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
        

        checkMealValidation() {
            this.loading = true
            this.resultLoading = true;
            this.user = '';
            this.error = '';
            this.success = null;
            this.validationSuccessful = null;
            this.validationCheckSuccessful = null;

            const body = {user_id: this.result, meal_id: this.currentMeal.id}
            fetch(API_URL + "../staff-api/meal-validation/check/?" + new URLSearchParams(body), {
                headers: AUTH_HEADER,
                method: 'GET'
            })
                .then((data) => {
                    if (data.ok) {
                        return data.json()
                    }
      if (data.status === 403) {
        window.location.href = '/login'
      }
                    this.error = data.status + " " + data.statusText
                    this.success = false
                    throw new Error('Request failed!')
                })
                .then((data) => {
                    this.success = data.success ? null : false
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
      if (data.status === 403) {
        window.location.href = '/login'
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
                    return data.json()
                }
      if (data.status === 403) {
        window.location.href = '/login'
      }
                throw new Error('Request failed!')
            })
            .then((data) => {
                if (!data.id) {
                    this.currentMeal = null
                    return
                }
                this.currentMeal = data
            })
            .catch((error) => {
                console.error('There was an error!', error)
            })
            .finally(() => {
                this.currentMealLoadng = false
            })
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


.center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
  margin-top: 12px;

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