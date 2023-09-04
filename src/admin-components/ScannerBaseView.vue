<script setup>
import LoadingIndicator from '../components/LoadingIndicator.vue'
import QrcodeStream from 'vue-qrcode-reader/src/components/QrcodeStream.vue'

defineProps(['hideScanner', 'codeText', 'codeFrameColor'])
defineEmits(['error', 'result']);
</script>

<template>
  <input
    type="text"
    pattern="[0-9]*" inputmode="numeric"
    maxLength="6"
    placeholder="Wpisz kod"
    class="search"
    v-model="searchQuery"
    @input="
      (event) => {
        if (event.target.value.length > event.target.maxLength)
          searchQuery = event.target.value.slice(0, event.target.maxLength)
      }
    "
  />
  <button class="button success" @click="search" v-if="searchQuery != '' && !hideScanner">
    Sprawdź
  </button>

  <div class="scanner">
    <p class="error">{{ qrReaderError }}</p>
    <div class="scanner-inside" :class="{ hidden: qrScannerLoading || hideScanner }">
      <QrcodeStream
        ref="qrcodestream"
        @decode="onDecode"
        @init="onInit"
        :track="track"
        :camera="camera"
        :torch="torch"
        :constrains="{ focusMode, focusDistance }"
        v-if="!disable"
      />
    </div>
    <LoadingIndicator v-if="qrScannerLoading" inline />
  </div>
      <button class="button" v-if="torchSupported" @click="torch = !torch" style="margin-top: 5px; 
  padding: 10px 35px; font-size: 13px; margin: 0;">
        {{ torch ? 'Wyłącz latarkę' : 'Włącz latarkę' }}
      </button>
</template>

<script>
export default {
  data() {
    return {
      originalResult: '',
      searchQuery: '',
      qrReaderError: '',
      qrScannerLoading: true,
      disable: false,
      camera: 'auto',
      torch: false,
      torchSupported: false,
      facingMode: 'user',
      focusMode: "manual",
      focusDistance: 0
    }
  },
  beforeUnmount() {
    this.$refs.qrcodestream.beforeResetCamera()
    this.$refs.qrcodestream.destroyed = true
  },
  methods: {
    isNumeric(str) {
      if (typeof str != 'string') return false // we only process strings!
      return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
      ) // ...and ensure strings of whitespace fail
    },
    onDecode(result) {
      if (result === '') return
      if (this.currentMealLoadng) return
      this.originalResult = result
      this.result = result.substring(result.lastIndexOf('/') + 1)
      if (this.result.length > 6 || !this.isNumeric(this.result)) {
        this.result = ''
        this.error = 'Błędny kod'
        this.$emit('error', this.error)
        // this.$emit('result', this.result)
        return
      }
      this.userRead(this.result)
    },
    fillWithZeros(bandId) {
      return bandId.padStart(6, '0')
    },
    search() {
      if (this.currentMealLoadng) return
      this.result = this.fillWithZeros(this.searchQuery)
      this.userRead(this.result)
      this.searchQuery = ''
    },

    userRead(user_id) {
      this.$emit('result', user_id)
    },

    async onInit(promise) {
      try {
        this.qrReaderError = null;
        
        var capabilities = (await promise).capabilities;
        this.torchSupported = !!capabilities.torch
        console.log("Camera capabilities:", capabilities)
        console.log("Torch supported:", this.torchSupported)
        console.log("Camera capabilities focusDistance:", capabilities.focusDistance)

        if (capabilities.focusDistance) {
          try {
            this.focusDistance = capabilities.focusDistance.min

            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: this.facingMode,
                focusMode: this.focusMode,
                focusDistance: this.focusDistance,
                zoom: true
              }
            });

            const [track] = stream.getVideoTracks();
            await track.applyConstraints({
              focusMode: "manual",
              focusDistance: capabilities.focusDistance.min
            });
          } catch (err) {
            console.error("applyConstraints() failed: ", err);
          }
        }
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.qrReaderError = 'ERROR: musisz dać pozwolenie na dostęp do kamery'
        } else if (error.name === 'NotFoundError') {
          this.qrReaderError = 'ERROR: brak kamery w tym urządzeniu'
        } else if (error.name === 'NotSupportedError') {
          this.qrReaderError = 'ERROR: potrzebujesz HTTPS'
        } else if (error.name === 'NotReadableError') {
          this.qrReaderError = 'ERROR: Nie można uzyskać dostępu do kamery. Być może jest ona już używana'
        } else if (error.name === 'OverconstrainedError') {
          this.qrReaderError = 'ERROR: Twój sprzęt nie obsługuje wymaganych rozdzielczości'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.qrReaderError = 'ERROR: Stream API nie jest obsługiwane w tej przeglądarce'
        } else if (error.name === 'InsecureContextError') {
          this.qrReaderError = 'ERROR: Nie można uzyskać dostępu do kamery z niezabezpieczonej strony'
        } else {
          this.qrReaderError = `ERROR: Error kamery (${error.name})`
        }
      } finally {
        this.qrScannerLoading = false
      }
    },
    track(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

        //outline
        const gradient = ctx.createLinearGradient(0, 0, 200, 0)
        gradient.addColorStop('0', '#de7539')
        gradient.addColorStop('1.0', '#dea766')

        // ctx.strokeStyle = "#de7539";
        ctx.strokeStyle =
          this.codeFrameColor && this.originalResult == detectedCode.rawValue
            ? this.codeFrameColor
            : 'gray'
        ctx.lineWidth = 10

        ctx.beginPath()
        ctx.moveTo(firstPoint.x, firstPoint.y)
        for (const { x, y } of otherPoints) {
          ctx.lineTo(x, y)
        }
        ctx.lineTo(firstPoint.x, firstPoint.y)
        ctx.closePath()
        ctx.stroke()

        //text
        const { boundingBox } = detectedCode

        const centerX = boundingBox.x + boundingBox.width / 2
        const centerY = boundingBox.y + boundingBox.height / 2

        const fontSize = Math.max(12, (55 * boundingBox.width) / ctx.canvas.width)

        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'center'

        const value = this.codeText ? this.codeText : ''

        ctx.lineWidth = 3
        ctx.strokeStyle = 'white'
        ctx.strokeText(value, centerX, centerY)

        ctx.fillStyle = 'black'
        ctx.fillText(value, centerX, centerY)
      }
    }
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
  font-family: 'Sui Generis';
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
  font-family: 'Sui Generis';

  display: flex;
  justify-content: center;

  margin-bottom: 12px;

  background-color: var(--bg-light);
}
.success {
  background-color: green;
}
</style>
