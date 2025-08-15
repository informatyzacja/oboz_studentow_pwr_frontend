<script setup>
import { IonPage, IonContent, IonNavLink, IonButton, onIonViewWillEnter, onIonViewDidLeave } from '@ionic/vue';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useBerealPostStore } from '@/stores/berealPost.js';
import CancelIcon from '../../assets/icons8-cancel.png';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { ScreenOrientation } from '@capacitor/screen-orientation';

// State
const firstPhoto = ref(null);
const secondPhoto = ref(null);
const orientationAngle = ref(0); // 0 portrait, 270 left landscape, 90 right landscape inferred
const orientationType = ref('unknown');
// store orientation at capture time for each photo
const captureOrientationAngles = ref([]); // [angleFirst, angleSecond]
const berealPostStore = useBerealPostStore();
const router = useRouter();

// Computed
const previewFirstPhoto = computed(() => {
    if (!firstPhoto.value) return {};
    const src = `data:image/jpeg;base64,${firstPhoto.value}`;
    // When app is locked portrait but device is rotated landscape-right, CSS top/left may visually map to bottom/right.
    // To keep the preview in the physical top-left corner, switch anchoring for landscape-right.
    if (isRightLandscape.value) {
        return {
            backgroundImage: `url(${src})`,
            top: 'auto',
            left: '10px',
            bottom: '90px',
            right: 'auto'
        };
    }
    // Default (portrait or landscape-left): use top-left.
    return { backgroundImage: `url(${src})`, top: '40px', left: 'auto', bottom: 'auto', right: '20px' };
});
const isLeftLandscape = computed(() => orientationAngle.value === 270 || orientationAngle.value === -90);
const isRightLandscape = computed(() => orientationAngle.value === 90);
const isLandscape = computed(() => isLeftLandscape.value || isRightLandscape.value);
const debugOrientation = computed(() => `${orientationAngle.value}°`);

// Functions
async function refreshOrientation() {
    try {
        const info = await ScreenOrientation.orientation();
        orientationType.value = info.type; // e.g. 'landscape-primary', 'portrait-primary'
        // Map type to our angle semantics
        // We treat 'landscape-primary' or 'landscape-secondary' as 270 (left) if primary, 90 if secondary (heuristic)
            if (info.type.startsWith('landscape')) {
                // On iOS/Android primary vs secondary may swap depending on sensor orientation; keep both.
                orientationAngle.value = info.type === 'landscape-primary' ? 270 : 90;
        } else {
            orientationAngle.value = 0;
        }
    } catch (e) {
        orientationType.value = 'error';
    }
}

// Listen for orientation change events from plugin
async function addOrientationListener() {
    try {
        await ScreenOrientation.addListener('screenOrientationChange', () => {
            refreshOrientation();
        });
    } catch (e) {
    // Fallback usunięty na życzenie – brak dodatkowych listenerów
    }
}

async function capture() {
    if (!isLandscape.value) return; // require any landscape orientation
    const result = await CameraPreview.capture({ quality: 85 });
    const base64PictureData = result.value;
    if (!firstPhoto.value) {
        firstPhoto.value = base64PictureData;
        captureOrientationAngles.value[0] = orientationAngle.value;
        CameraPreview.flip();
        return;
    }
    if (!secondPhoto.value) {
        secondPhoto.value = base64PictureData;
        captureOrientationAngles.value[1] = orientationAngle.value;
    }
    await showPostPreview();
}

function rotateBase64Image(base64, angle = -90) {
    return new Promise(resolve => {
        try {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const rad = angle * Math.PI / 180;
                const swap = angle % 180 !== 0;
                canvas.width = swap ? img.height : img.width;
                canvas.height = swap ? img.width : img.height;
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(rad);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                resolve(dataUrl.split(',')[1]);
            };
            img.onerror = () => resolve(base64);
            img.src = 'data:image/jpeg;base64,' + base64;
        } catch (e) {
            resolve(base64);
        }
    });
}

async function showPostPreview() {
    // Decide rotation based on orientation captured. Adjust angles to standard upright orientation.
    const decideRotation = (angle) => {
        if (angle === 270 || angle === -90) return -90; // left landscape -> rotate clockwise 90
        if (angle === 90) return 90; // right landscape -> rotate counter-clockwise 90
        return 0;
    };
    const a1 = captureOrientationAngles.value[0];
    const a2 = captureOrientationAngles.value[1];
    const rotated1 = firstPhoto.value ? await rotateBase64Image(firstPhoto.value, decideRotation(a1)) : null;
    const rotated2 = secondPhoto.value ? await rotateBase64Image(secondPhoto.value, decideRotation(a2)) : null;
    firstPhoto.value = null;
    secondPhoto.value = null;
    captureOrientationAngles.value = [];
    berealPostStore.photo1 = rotated1;
    berealPostStore.photo2 = rotated2;
    router.push('/bereal/preview');
}

// Lifecycle
onMounted(() => {
    refreshOrientation();
    addOrientationListener();
});
onIonViewWillEnter(() => {
    CameraPreview.start({ parent: 'cameraPreview', position: 'rear', toBack: true, disableAudio: true });
    refreshOrientation();
});
onIonViewDidLeave(() => {
    CameraPreview.stop();
});

</script>

<template>
    <ion-page>
        <ion-content :fullscreen="true" class="camera-preview-content" scroll-y="false">
            <div class="camera-container">
        <!-- Overlay shown when orientation is not any landscape -->
        <div v-if="!isLandscape" class="orientation-overlay">
            <div class="orientation-box">
                <p class="orientation-text">Obróć telefon w tryb poziomy</p>
            </div>
        </div>
        <div id="first-photo-preview" :style="previewFirstPhoto"></div>
        <div id="cameraPreview"></div>
        <div id="camera-button-container">
            <div id="camera-button" @click="capture" :class="{ disabled: !isLandscape }"></div>
                </div>
                <IonNavLink router-link="/bereal/home/" router-direction="back" class="link">
                    <img :src="CancelIcon" class="cancel-button" />
                </IonNavLink>
            </div>
        </ion-content>
    </ion-page>
</template>

<!-- Removed Options API script; migrated to Composition API above -->

<style>
.camera-preview-content {
    --background: transparent;
    background-image: none;
}
.camera-container {
    position: relative;
    width: 100%;
    height: 100%;
    /* background-color: black; */
}
#cameraPreview, video {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}
#camera-button-container {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
}
#camera-button {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: white 5px solid;
    margin: 20px;
    box-shadow: black 0px 0px 10px;
}
#first-photo-preview {
    position: absolute;
    width: 40%;
    aspect-ratio: 9/16;
    z-index: 20;
    /* dynamic positioning (top/left or bottom/right) applied inline */
    border-radius: 20px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: top 0.2s, left 0.2s, bottom 0.2s, right 0.2s;
}
.cancel-button {
    position: absolute;
    left: 10px;
    bottom: 10px;
    width: 40px;
    height: 40px;
    z-index: 10;
    filter: invert(1);
}
.orientation-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.75);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
}
.orientation-box {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 16px;
    padding: 24px 32px;
    backdrop-filter: blur(6px);
}
.orientation-text {
    color: #fff;
    font-size: 20px;
    margin: 0;
    font-weight: 600;
}
.orientation-sub {
    color: #ccc;
    font-size: 14px;
    margin: 0;
}
</style>