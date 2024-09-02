<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import ScannerBaseView from './ScannerBaseView.vue'
import moment from 'moment'
import OverlayView from '../components/OverlayView.vue'

import { apiRequest } from '../stores/functions.js'
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>
  <ion-page>

    <OverlayView ref="chooseMeal">
      <div class="choose-meal-overlay">
        <div v-for="meal in currentMeals" :key="meal.id">
          <button @click="currentMeal = meal; $refs.chooseMeal.hide()">
            {{ meal.name }}, {{ moment(meal.start).format('dddd DD.MM') }}
          </button>
        </div>
        <button class="red-bg" @click="$refs.chooseMeal.hide()">Zamknij</button>
      </div>
    </OverlayView>


    <ion-content :fullscreen="false">
      <main>
        <TopBar title="Walidacja posiłków" backLink="/skaner" />

        <div class="padding-main">
          <!-- <h3>Tryb skanowania</h3>
        <ItemBox bigText="Walidacja posiłków" small/> -->
          <!-- <h3>Posiłek</h3> -->
          <ItemBox :bigText="currentMealLoadng
            ? 'Ładowanie...'
            : currentMeal
              ? currentMeal.name + ', ' + moment(currentMeal.start).format('dddd DD.MM')
              : (currentMeals.length ? 'Wybierz posiłek' : 'Obecnie nie odbywa się żaden posiłek')
            " small @click="chooseMeal()" />

          <div class="center">
            <ScannerBaseView @error="(err) => (error = err)" @result="(res) => {
              result = res
              checkMealValidation()
            }
              " :hideScanner="currentMealLoadng || !currentMeal"
              :codeText="!resultLoading ? user || error : 'Ładowanie...'"
              :codeFrameColor="resultLoading ? 'gray' : success ? 'green' : '#9a2929'" />

            <div class="result" :class="{ error: success === false, success: success === true }" v-if="
              result ||
              user ||
              error ||
              resultLoading ||
              (validationCheckSuccessful && !validationSuccessful && !resultLoading)
            ">
              <p v-if="result">Kod: {{ result }}</p>
              <h4>{{ user }}</h4>
              <h5 v-if="user_title">{{ user_title }}</h5>
              <h6 v-if="user_diet">Dieta: {{ user_diet }}</h6>
              <h5>{{ error }}</h5>
              <LoadingIndicator v-if="resultLoading" inline small />
              <button class="button success" v-if="validationCheckSuccessful && !validationSuccessful && !resultLoading"
                @click="validateMeal">
                Zatwierdź
              </button>
            </div>
          </div>
        </div>
      </main>
    </ion-content>
  </ion-page>
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
      currentMeals: []
    }
  },
  methods: {
    checkMealValidation() {
      this.loading = true
      this.resultLoading = true
      this.user = ''
      this.error = ''
      this.success = null
      this.validationSuccessful = null
      this.validationCheckSuccessful = null

      const body = { user_id: this.result, meal_id: this.currentMeal.id }
      apiRequest('../staff-api/meal-validation/check/?' + new URLSearchParams(body))
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
      this.resultLoading = true
      const body = { user_id: this.result, meal_id: this.currentMeal.id }
      apiRequest('../staff-api/meal-validation/validate/',
        'PUT',
        body
      )
        .then((data) => {
          this.success = data.success
          this.validationSuccessful = data.success
          this.error = data.error
          if (this.success) {
            this.error = 'Zatwierdzono'
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
      apiRequest('../staff-api/meal-validation/current-meals/')
        .then((data) => {
          this.currentMeals = data
          if (data.length === 1) {
            this.currentMeal = data[0]
          } else {
            this.currentMeal = null
          }
        })
        .catch((error) => {
          this.currentMeals = null
          console.error('There was an error!', error)
        })
        .finally(() => {
          this.currentMealLoadng = false
        })
    },

    chooseMeal() {
      if (this.currentMeals.length > 1) {
        this.$refs.chooseMeal.show();
      } else if (this.currentMeals.length === 1) {
        this.currentMeal = this.currentMeals[0];
      }
    }
  }

}
</script>

<style scoped>
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

.result h5,
.result h6,
.result p {
  margin: 0 !important;
}

.error {
  background-color: var(--red);
}

.success {
  background-color: green;
}

.choose-meal-overlay {
  padding: 10px;
  padding-bottom: 20px;
  margin: 20px auto;
  width: 95%;
  background: var(--bg-lighter);
  border-radius: 28px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

button {
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;

  background-color: var(--bg);

  width: 130px;
  display: flex;
  justify-content: center;

  margin: 0 auto;
  margin-top: 10px;
}

.red-bg {
  background-color: var(--red);
}
</style>
