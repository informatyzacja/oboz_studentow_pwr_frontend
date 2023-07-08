<script setup>

import { registerForPushNotifications } from '../config.js'
import { isSupported } from "firebase/messaging";
defineEmits(['hide']);

</script>

<template>
    <div class="padding">
        <div class="overlay">
            
            <p v-if="iOSversionTooLow" style="text-align: center;">Twoja wersja iOS jest za niska, aby obsługiwać powiadomienia. Zaktualizuj system do wersji iOS 16.4 lub wyższej.</p>

            <p v-else-if="showInstallMessage" style="text-align: center;">Aby włączyć powiadomienia, dodaj aplikację do ekranu początkowego.</p>

            <div v-else>
                <p style="text-align: center;">Otrzymuj powiadomienia o tym co się aktualnie dzieje, o zmianach w harmonogramie i wiele więcej!</p>
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
            iOSversionTooLow: false,
            showInstallMessage: false
        }
    },
    onMounted() { 
    },

  computed: {
    isIos() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipod/.test( userAgent );
    },
    isInStandaloneMode() {
      return ('standalone' in window.navigator) && (window.navigator.standalone);
    },
    iOSversion() {
      const userAgent = window.navigator.userAgent
      if (/iP(hone|od|ad)/.test(userAgent)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (userAgent).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      }
      return false;
    }
  },
  methods: {
    register() {
        if (isSupported() && ("Notification" in window)) {
            registerForPushNotifications()
        } else if (this.isIos && (this.iOSversion[0] < 16 || (this.iOSversion[0] === 16 && this.iOSversion[1] < 4))) {
            this.iOSversionTooLow = true
            return
        } else if (this.isIos && !this.isInStandaloneMode) {
            this.showInstallMessage = true
            return
        }
        this.close()
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
.overlay {
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
  font-family: 'Sui Generis';
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
