<script setup>
import GenericGroupView from './GenericGroupView.vue';

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>


<template>
    <GenericGroupView title="Frakcja" backLink="/profil" mapDescription="Miejsce spotkań" messengerDescription="Grupa frakcji" 
    :ready="apiDataStore.profile.ready" 
    :loading="apiDataStore.loading"
    :error="apiDataStore.error"
    :group="apiDataStore.profile.ready ? apiDataStore.profile.data[0].fraction : {}"
     ></GenericGroupView>
</template>


<script>
export default {
  computed: {
    ...mapStores(useApiDataStore),
  },
  mounted() {
    this.apiDataStore.profile.fetchData()
  },
}
</script>