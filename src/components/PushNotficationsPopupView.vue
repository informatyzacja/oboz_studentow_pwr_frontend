<script setup>

import { registerForPushNotifications } from '../config.js'
defineEmits(['hide']);

</script>

<template>
  <div class="padding">
    <div class="overlay-card">
      <div>
        <p style="text-align: center;">Bądź na bieżąco w każdej chwili, dzięki włączonym powiadomieniom! Będziemy
          informować Cię o tym, co się aktualnie dzieje, o wszelkich zmianach i wiadomościach!</p>
        <div class="buttons">
          <button @click="register" class="button success">Włącz powiadomienia</button>
          <button class="button red-bg" @click="close">Może później</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },

  computed: {
  },
  methods: {
    register() {
      registerForPushNotifications().then(() => {
        this.close()
      })
    },
    close() {
      this.$emit('hide')
    }
  },
  mounted() {
  }

}

</script>

<style scoped>
.overlay-card {
  box-sizing: border-box;
  /* width: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* margin: 30px 10px; */

  background: var(--bg-lighter);
  padding: 20px 10px;
  border-radius: 20px;
}

button,
a.button {
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;

  background-color: var(--bg-light);

  width: 140px;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 20px;
}

.button.success {
  background-color: green;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
