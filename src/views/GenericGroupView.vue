<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import TextBox from '../components/TextBox.vue'


defineProps({
  title: String,
  backLink: String,
  mapDescription: String,
  messengerDescription: String,
  group: Object,
  ready: Object,
  loading: Boolean,
  error: Boolean,
});

</script>

<template>
  <TopBar :title="title" :backLink="$router.options.history.state.back || backLink "/>
  <p v-if="!group">Nie znaleziono grupy</p>
  <div class="padding"  v-if="group">
    <div class="flex">
      
      <div class="logo">
        <img :src="group.logo" />
      </div>

      <p class="name">
        {{ group.name }}
      </p>

      <div class="spacer"></div>

    </div>  


    <TextBox v-if="group.description" :content="group.description" />
    <div class="spacer" v-if="group.description"></div>

    <h3 v-if="group.map">{{ mapDescription }}</h3>
    <div class="map">
      <img v-if="group.map" :src="group.map" />
    </div>

    <a v-if="group.messenger" :href="group.messenger" target="_blank">
      <ItemBox :bigText="messengerDescription" leftIcon="/vue-public/icons8-facebook_messenger.png" rightIcon="/vue-public/arrow.svg" />
    </a>

    <h3>Opiekunowie</h3>
    <div
      v-if="
        ready &&
        group.wardens &&
        group.wardens.length
      "
    >
      <a
        v-for="(data, index) in group.wardens"
        :key="index"
        :href="'tel:' + data.phoneNumber"
      >
        <ItemBox
          :bigText="data.first_name + ' ' + data.last_name"
          :smallText="data.title"
          :leftIcon="data.photo"
          rightIcon="/vue-public/phone_icon.svg"
        />
      </a>
    </div>


    <LoadingIndicator v-if="loading" />
    <p v-if="error" class="error">Błąd wczytywania</p>

  </div>
</template>

<style scoped>
h1 {
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 5px 2px;
  font-size: 13px;
}

h6 {
  color: var(--text-gray);
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
  font-family: 'Sui Generis';
  background-color: var(--bg-light);

  width: 130px;
  display: flex;
  justify-content: center;

  margin-top: 20px;
}
.logo {
  width: 140px;
  height: 140px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
.map img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border-radius: 20px;
}

.hidden {
  display: none;
}

.name {
  font-size: 23px;
  line-height: 25px;
  margin-top: 15px;
}

.email {
  font-size: 13px;
  color: var(--text-gray);
}

.itemBoxContainer {
  width: 100%;
}

.spacer {
  height: 15px;
}

.flex {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>

