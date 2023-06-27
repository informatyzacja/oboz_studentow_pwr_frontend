<script setup>
import TopBar from '../components/navigation/TopBar.vue';
import ItemBox from '../components/ItemBox.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';

import rightArrow from '../assets/arrow.svg';

import { API_URL, AUTH_HEADER } from '../config.js'
</script>

<template>
    <TopBar title="Frakcje" backLink="/admin-menu"/>

    <div class="padding" v-if="ready && data">
        <RouterLink :to="frakcjaLink+'/'+data.id"  v-for="(data, index) in data" :key="index">
            <ItemBox
            :bigText="data.name"
            :leftIcon="data.logo"
            :rightIcon="frakcjaLink ? rightArrow : ''"
            />
        </RouterLink>
    </div>

    <LoadingIndicator v-if="loading" />
    <p v-if="error" class="error">{{ error }}</p>

</template>



<script>
export default {
  data() {
    return {
      data: {},
      ready: false,
      loading: true,
      error: null,
      timer: null,
      frakcjaLink: '/frakcja',
    }
  },
  computed: {
  },
  mounted() {
    this.fetchFractionData()
    this.timer = setInterval(this.fetchFractionData, 300000);
  },
  methods: {
    fetchFractionData() {
      fetch(API_URL + "../staff-api/get-fractions/", {
          headers: AUTH_HEADER,
          method: 'GET'
      })
      .then((data) => {
          if (data.ok) {
              return data.json()
          }
          throw new Error(data.statusText)
      })
      .then((data) => {
          if (data.error) {
              this.error = data.error
              this.ready = false
              return
          }
          this.error = null
          this.data = data
          this.ready = true
      })
      .catch((error) => {
          this.error = error
          console.error('There was an error!', error)
      })
      .finally(() => {
          this.loading = false
      })
    }
  },
  beforeUnmount () {
    clearInterval(this.timer);
  }
}
</script>