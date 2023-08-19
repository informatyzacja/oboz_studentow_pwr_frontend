<script setup>

import OverlayView from './OverlayView.vue';
</script>

<template>
  <div>
    <div class="padding" v-if="deferredPrompt">
        <div class="overlay-card">

            <div>
                <p style="text-align: center;">Zainstaluj aplikację, aby mieć do niej dostęp w każdej chwili bezpośrednio z Twojego ekranu początkowego!</p>
                <div class="buttons">
                    <button @click="installApp" class="button success">Zainstaluj</button>
                    <button class="button red-bg" @click="deferredPrompt=null">Może później</button>
                </div>
            </div>

        </div>
    </div>


  <OverlayView ref="iosInstallMessage">
    <div class="ios-install-message">
      <p>
        Aby zainstalować aplikację, kliknij <img src="@/assets/icons8-share_rounded.png" alt="share" /> i wybierz opcję <span style="white-space: nowrap;">"Do ekranu początkowego <img src="@/assets/icons8-add_new.png" alt="icon" style="margin-bottom: -8px"/>"</span>
      </p>
      <div class="ios-install-message-close" @click="$refs.iosInstallMessage.hide">Może później</div>
    </div>
    <div class="ios-install-arrow"></div>
  </OverlayView>


</div>

</template>

<script>
export default {
    data() {
        return {
            deferredPrompt: null,
            showIosInstallMessage: false
        }
    },

  computed: {
    isIos() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipod/.test( userAgent );
    },
    isInStandaloneMode() {
      return ('standalone' in window.navigator) && (window.navigator.standalone);
    }
  },
  methods: {
    async installApp() {
      if (this.deferredPrompt && this.deferredPrompt !== 'ios') {
        this.deferredPrompt.prompt();
        
        const { outcome } = await this.deferredPrompt.userChoice;
        
        this.deferredPrompt = null;
        
        if (outcome === 'accepted') {
          console.log('😀 User accepted the install prompt.');
          this.close()
        } else if (outcome === 'dismissed') {
          console.log('😟 User dismissed the install prompt');
        }

      } else if (this.deferredPrompt === 'ios') {
        this.$refs.iosInstallMessage.show()
        this.deferredPrompt = null
      }
    }
  },
  mounted() {
    if (this.isIos && !this.isInStandaloneMode) {
      this.deferredPrompt = 'ios'
    }
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
     
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
  margin: 5px 0;
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





.ios-install-message {
  position: fixed;
  bottom: 28px;
  left: 10px;
  right: 10px;
  background-color: var(--bg-light);
  padding: 12px 10px;
  z-index: 11;
  border-radius: 20px;
  
  display: flex;
  align-items: center;
  justify-content: center;

}

.ios-install-message p {
  margin: 0;
  padding: 0;
  margin-bottom: 5px;
  font-size: 13px;
  text-align: center;
}

.ios-install-message img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin-bottom: -5px;
}

.ios-install-arrow {
  position: fixed;
  bottom: 18px;
  left: calc(50% - 20px);
  width: 40px;
  height: 40px;
  rotate: 45deg;

  background-color: var(--bg-light);
  z-index: 10;
}

.ios-install-message-close {
  padding: 0 10px;
  color: var(--theme-light);
  text-align: center;
}
</style>
