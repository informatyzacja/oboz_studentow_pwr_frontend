<script setup>
import { isPlatform } from '@ionic/vue';
import LoadingIndicator from '../components/LoadingIndicator.vue'
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';

defineProps(['hideScanner', 'codeText', 'codeFrameColor'])
defineEmits(['error', 'result']);
</script>

<template>
  <input type="text" pattern="[0-9]*" inputmode="numeric" maxLength="6" placeholder="Wpisz kod" class="search"
    v-model="searchQuery" @input="(event) => {
      if (event.target.value.length > event.target.maxLength)
        searchQuery = event.target.value.slice(0, event.target.maxLength)
    }
      " />
  <button class="button success" @click="search" v-if="searchQuery != '' && !hideScanner">
    Sprawdź
  </button>


  <button class="button success" @click="startStan" v-if="!disable">
    Otwórz skaner
  </button>

  <p class="error" v-if="qrReaderError">{{ qrReaderError }}</p>

</template>

<script>
export default {
  data() {
    return {
      originalResult: '',
      searchQuery: '',
      disable: false,
      qrReaderError: null,
    }
  },

  async mounted() {
    try {
      (await BarcodeScanner.isSupported()).supported ? this.disable = false : this.disable = true
      if (this.disable) {
        console.log('Twoje urządzenie nie obsługuje skanowania kodów QR')
        this.qrReaderError = 'ERROR: Twoje urządzenie nie obsługuje skanowania kodów QR'
        return
      }
    } catch (error) {
      console.error('Error checking if BarcodeScanner is supported', error)
      this.qrReaderError = 'ERROR: Twoje urządzenie nie obsługuje skanowania kodów QR';
      this.disable = true
    }

  },

  methods: {
    async startStan() {
      const granted = await this.requestPermissions();
      if (!granted) {
        console.log('Permission denied', 'Please grant camera permission to use the barcode scanner.');
        return;
      }
      if (isPlatform('android')) {
        const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
        if (!available) {
          console.log('Google Barcode Scanner module is not available');
          this.qrReaderError = 'ERROR: Moduł Google Barcode Scanner nie jest dostępny, próbuję zainstalować';
          BarcodeScanner.addListener('googleBarcodeScannerModuleInstallProgress', (event) => {
            if (event.state = 4) {
              // COMPLETED
              console.log('Google Barcode Scanner was installed successfully');
              this.qrReaderError = 'Moduł Google Barcode Scanner został zainstalowany, spróbuj ponownie. Jeżeli problem nadal występuje, zainstaluj "Usługi operatora" (ang. "Google Play services") z Google Play';
            } else if (event.state = 5) {
              // FAILED
              console.log('Google Barcode Scanner was not installed');
              this.qrReaderError = 'ERROR: Moduł Google Barcode Scanner nie jest dostępny i nie został zainstalowany. Jeżeli problem nadal występuje, zainstaluj "Usługi operatora" (ang. "Google Play services") z Google Play.';
            } else {
              console.log('Google Barcode Scanner installation in progress');
              this.qrReaderError = 'Moduł Google Barcode Scanner jest instalowany (status: ' + event.state + ', progres: ' + event.progress + ')';
            }
          });
          BarcodeScanner.installGoogleBarcodeScannerModule();
          return;
        }
      }
      const { barcodes } = await BarcodeScanner.scan();
      console.log('Barcodes:', barcodes);
      this.onDecode(barcodes);
    },
    async requestPermissions() {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted' || camera === 'limited';
    },
    isNumeric(str) {
      if (typeof str != 'string') return false // we only process strings!
      return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
      ) // ...and ensure strings of whitespace fail
    },
    onDecode(result) {
      this.originalResult = result[0].rawValue
      this.result = this.originalResult.substring(result.lastIndexOf('/') + 1)
      if (this.result.length > 6 || !this.isNumeric(this.result)) {
        this.result = ''
        this.error = 'Błędny kod'
        this.$emit('error', this.error)
        return
      }
      this.userRead(this.result)
    },
    fillWithZeros(bandId) {
      return bandId.padStart(6, '0')
    },
    search() {
      this.result = this.fillWithZeros(this.searchQuery)
      this.userRead(this.result)
      this.searchQuery = ''
    },

    userRead(user_id) {
      this.$emit('result', user_id)
    },
  }
}
</script>

<style scoped>
.search {
  width: 50%;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;

  background-color: var(--bg-light);
  color: white;
  outline: none;
}

.scanner {
  width: 80vw;
  height: 80vw;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.scanner-inside {
  width: 100%;
  height: 100%;
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

  background-color: var(--bg-light);
}

.success {
  background-color: green;
}
</style>
