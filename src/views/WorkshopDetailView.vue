<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import IconLocation from '../components/icons/IconLocation.vue'
import TextBox from '../components/TextBox.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <!-- <TopBar title="Warsztaty" /> -->
  <main>
    <!-- TODO: Add day changer -->
    <div v-if="apiDataStore.workshops.ready &&
      apiDataStore.workshops.data.length" 
      :set="data = apiDataStore.workshops.withId(parseInt($route.params.id))">

      <div class="card">

        <img class="bg" :src="data.photo" />
        <div class="time">
          <p>{{ moment(data.start).format('dd. DD.MM') }}</p>
          <p>{{ moment(data.start).format('hh:mm') + ' - ' + moment(data.end).format('hh:mm') }}</p>
        </div>
        <div class="overlay"></div>
        <div class="description">
          <h2>
            <IconLocation class="icon" /> {{ data.location }}
          </h2>
          <h1>{{ data.name }}</h1>
          <h3>{{ data.userCount + '/' + data.userLimit }} osób</h3>
        </div>

        </div>

          <TextBox :content="data.description" />

          <div class="padding" v-if="data.workshopleaders && data.workshopleaders.length">

            <h3>Prowadzący</h3>
            <ItemBox
              v-for="(data, index) in data.workshopleaders"
              :key="index"
              :bigText="data.first_name + ' ' + data.last_name"
              :smallText="data.title"
              :leftIcon="data.photo"
            />
          </div>

    </div>


    <LoadingIndicator v-if="apiDataStore.workshops.loading" />
    <p v-if="apiDataStore.workshops.error" class="error">Błąd wczytywania</p>
  </main>
</template>

<style scoped>

.padding {
  padding: 0px 20px;
}

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 5px 2px;
  font-size: 13px;
}


.error {
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
}
.card {
  width: 100%;
  height: 325px;
  background-color: black;
  position: relative;

  display: inline-block;
  margin-bottom: 10px;
}

.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.time {
  background-color: white;
  border-radius: 10px;
  float: right;
  color: black;
  margin: 20px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 16px;
  position: absolute;
  right: 0;
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 44.08%, var(--bg-lighter) 73.74%);
}

.description {
  position: absolute;
  bottom: 0;
  padding: 20px;
}

.description h1 {
  font-size: 24px;
  line-height: 24px;
  padding: 5px 0 0;
  white-space: normal;
}

.description h2 {
  font-size: 17px;
  line-height: 15px;
  color: var(--text-gray);
  display: flex;
  align-items: center;
  gap: 5px;
}

.description h3 {
  font-size: 15px;
  line-height: 15px;
  padding: 5px 0 0;
  color: var(--text-gray);
}

.description .icon {
  height: 16px;
  padding-bottom: 1px;
}

</style>

<script>
export default {
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.workshops.fetchData()
  }
}
</script>
