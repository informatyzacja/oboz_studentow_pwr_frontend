<script setup>
import ItemBox from '../components/ItemBox.vue';



</script>

<template>
    <div class="sos">
        <h1>SOS</h1>
        <h3>Ratownicy</h3>
        <div v-if="!lifeGuard.loading && lifeGuard.response && lifeGuard.response.length">
            <a v-for="(data, index) in lifeGuard.response" :key="index" :href="'tel:'+data.phoneNumber">
                <ItemBox  :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo" rightIcon="/phone_icon.svg" bgColor="var(--red)" />
            </a>
        </div>
        <p v-if="lifeGuard.response && !lifeGuard.response.length" class="error">Brak ratowników</p>
        <p v-if="lifeGuard.loading" class="loading">Ładowanie..</p>
        <p v-if="lifeGuard.error" class="error">Błąd wczytywania</p>


        <h3>Obecnie da dyżurze trzeźwości</h3>
        <div v-if="!soberDuty.loading && soberDuty.response && soberDuty.response.length">
            <a v-for="(data, index) in soberDuty.response" :key="index" :href="'tel:'+data.phoneNumber">
                <ItemBox  :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo" rightIcon="/phone_icon.svg" />
            </a>
        </div>
        <p v-if="soberDuty.response && !soberDuty.response.length" class="error">Nikt nie jest na dyżurze trzeźwości</p>
        <p v-if="soberDuty.loading" class="loading">Ładowanie..</p>
        <p v-if="soberDuty.error" class="error">Błąd wczytywania</p>

        <h3>Sztab</h3>
        <div v-if="!sztab.loading && sztab.response && sztab.response.length">
            <a v-for="(data, index) in sztab.response" :key="index" :href="'tel:'+data.phoneNumber">
                <ItemBox  :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo" rightIcon="/phone_icon.svg" />
            </a>
        </div>
        <p v-if="sztab.response && !sztab.response.length" class="error">Sztab sie najebał</p>
        <p v-if="sztab.loading" class="loading">Ładowanie..</p>
        <p v-if="sztab.error" class="error">Błąd wczytywania</p>

        <router-link to="/faq">
          <ItemBox class="faq" bigText="Więcej pomocy możesz znaleść w FAQ" rightIcon="/arrow.svg" />
        </router-link>
    </div>
</template>


<style scoped>
.sos {
    padding: 20px;
}

h1 {
  background: var(--radial-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 5px 2px;
  font-size: 12px;
}

.faq {
  position: absolute;
  bottom: 100px;
  left: 20px;
  right: 20px;
}

.error {
  color: red;
}

</style>

<script>
export default {
  data() {
    return {
      lifeGuard: {loading: true, error: null, response: null, url: 'lifeGuard/'},
      soberDuty: {loading: true, error: null, response: null, url: 'currentSoberDuty/'},
      sztab: {loading: true, error: null, response: null, url: 'contact/'}, 
    }
  },
  mounted() {
    this.loadData(this.lifeGuard);
    this.loadData(this.soberDuty);
    this.loadData(this.sztab);
  },
}
</script>