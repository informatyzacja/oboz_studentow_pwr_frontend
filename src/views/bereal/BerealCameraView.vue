<script setup>

import { IonPage, IonContent, IonIcon, IonButton, toastController, IonNavLink } from '@ionic/vue';
import { apiRequest } from '@/stores/functions'
import TopBar from '@/components/navigation/TopBar.vue'

import { useBerealPostStore } from '@/stores/berealPost.js'
import { mapStores } from 'pinia'

import CancelIcon from '../../assets/icons8-cancel.png';
import { Camera, CameraResultType } from '@capacitor/camera';

import { CameraPreview } from '@capacitor-community/camera-preview';


</script>

<template>
    <ion-page>
        <ion-content :fullscreen="true" class="camera-preview-content">
            <div class="camera-container">
                <div id="first-photo-preview" :style="previewFirstPhoto"></div>
                <div id="cameraPreview"></div>
                <div id="camera-button-container">
                    <div id="camera-button" @click="caputre"></div>
                </div>
                <IonNavLink router-link="/bereal/home/" router-direction="back" class="link">
                    <img :src="CancelIcon" class="cancel-button" />
                </IonNavLink>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data: () => ({
        firstPhoto: null,
        secondPhoto: null,
    }),
    computed: {
        ...mapStores(useBerealPostStore),
        previewFirstPhoto() {
            if (!this.firstPhoto) return {};
            const src = `data:image/jpeg;base64,${this.firstPhoto}`;
            return { backgroundImage: `url(${src})` };
        }
    },
    async mounted() {
        await CameraPreview.start({
            parent: 'cameraPreview',
            position: 'rear',
            // height: 9999,
            // width: 887,
            toBack: true,
            disableAudio: true
        });
    },
    methods: {
        async caputre() {
            console.log("capture")
            const result = await CameraPreview.capture({
                quality: 85
            });
            const base64PictureData = result.value; // raw base64 string

            if (!this.firstPhoto) {
                this.firstPhoto = base64PictureData;
                CameraPreview.flip()
                return
            }

            if (!this.secondPhoto) {
                this.secondPhoto = base64PictureData;
            }

            // CameraPreview.stop();
            await this.showPostPreview();
        },
        // Rotate a base64 (no prefix) JPEG by 90deg clockwise (default). Returns base64 without data URL prefix.
        rotateBase64Image(base64, angle = -90) {
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
        },
        async showPostPreview() {
            // Rotate both photos before storing (to correct orientation issues)
            const rotated1 = this.firstPhoto ? await this.rotateBase64Image(this.firstPhoto) : null;
            const rotated2 = this.secondPhoto ? await this.rotateBase64Image(this.secondPhoto) : null;
            this.firstPhoto = null;
            this.secondPhoto = null;
            this.berealPostStore.photo1 = rotated1;
            this.berealPostStore.photo2 = rotated2;
            this.$router.push('/bereal/preview');
        }
    }
}
</script>

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
    top: 20px;
    right: 20px;
    border-radius: 20px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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
</style>