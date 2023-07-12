<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import ScannerBaseView from './ScannerBaseView.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { API_URL, AUTH_HEADER } from '../config.js'
</script>

<template>
  <TopBar title="Dodaj punkty" backLink="/skaner" />

  <div class="padding" v-if="apiDataStore.pointTypes.ready">
    <h3>Rodziaj grupy</h3>
    <select v-model="selectedGroupType"
      @input="event => { selectedGroup = ''; selectedPointType = ''; selectedGroupType = event.target.value }">
      <option disabled value="">Wybierz rodzaj grupy</option>
      <option v-for="groupType in apiDataStore.pointTypes.data.groupTypes" :key="groupType.id" :value="groupType.name">
        {{ groupType.name }}
      </option>
    </select>

    <div v-if="selectedGroupType">
      <h3>Kategoria punktów</h3>
      <select v-model="selectedPointType">
        <option disabled value="">Wybierz kategorię punktów</option>
        <option v-for="pointType in apiDataStore.pointTypes.forGroupType(selectedGroupType)" :key="pointType.id"
          :value="pointType.id">
          {{ pointType.name }}
        </option>
      </select>
    </div>

    <div class="center">
      <ScannerBaseView v-if="selectedGroupType && !loading" @error="(err) => (error = err)" @result="(res) => {
          result = res
          showAddPointsView()
        }
        " />
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>

  <RouterLink :to="{ name: 'punkty-dodaj', params: { groupType: selectedGroupType, pointTypeId: selectedPointType } }">
    <button class="button" v-if="selectedGroupType">
      Wybierz grupę ręcznie
    </button>
  </RouterLink>
  
  <LoadingIndicator v-if="apiDataStore.pointTypes.loading || loading" />
  <p v-if="apiDataStore.pointTypes.error" class="error">{{ apiDataStore.pointTypes.error }}</p>
</template>

<script>
export default {
  data() {
    return {
      timer: null,

      result: '',

      loading: false,
      error: null,
      success: null,

      selectedGroupType: '',
      selectedPointType: '',
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
  },
  watch: {

    selectedPointType() {
      this.$router.replace({ params: { pointTypeId: this.selectedPointType } })
    },

    selectedGroupType() {
      this.$router.replace({  params: { groupType: this.selectedGroupType } })
    },

  },
  mounted() {
    if ( this.apiDataStore.pointTypes.ready) {
        if (this.$route.params.pointTypeId) {
            this.selectedPointType = parseInt(this.$route.params.pointTypeId)
            this.selectedGroupType = this.apiDataStore.pointTypes.getPointTypeById(this.selectedPointType).group_type.name
        } else if (this.$route.params.groupType) {
            this.selectedGroupType = this.$route.params.groupType
        }
    }

    this.apiDataStore.pointTypes.fetchData()
    this.timer = setInterval(this.apiDataStore.pointTypes.fetchData, 300000)
  },
  methods: {
    showAddPointsView() {
      this.loading = true
      const params = { user_id: this.result, group_type: this.selectedGroupType }
      fetch(API_URL + '../staff-api/get-user-group/?' + new URLSearchParams(params), {
        headers: AUTH_HEADER,
        method: 'GET'
      })
        .then((data) => {
          if (data.status === 403) {
            window.location.href = '/login/?next=' + window.location.pathname
            return
          }
          if (data.ok) {
            return data.json()
          }
          throw new Error('Request failed!')
        })
        .then((data) => {
          this.success = data.success
          if (data.success) {
            this.error = null
            this.$router.push({ name: 'punkty-dodaj', params: { groupId: data.group, pointTypeId: this.selectedPointType } })
          } else {
            this.error = data.error
          }
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
        .finally(() => {
          this.loading = false
        })

    },
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px 35px 10px 15px;
  border-radius: 20px;
  border: 1px solid var(--text-gray);
  margin-bottom: 2px;
  font-size: 15px;
  font-family: 'Sui Generis';
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

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 5px 2px;
  font-size: 13px;
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

  margin: 5px auto 12px;

  background-color: var(--bg-light);
  
}

</style>
