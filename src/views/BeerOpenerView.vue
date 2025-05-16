<script setup>
import beerOpenerSrc from '@/assets/Ikona otwieracza do piwa.webp';

import { IonPage, IonContent, IonButton } from '@ionic/vue';
import TopBar from '../components/navigation/TopBar.vue';
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar title="Otwieracz do piwa" :autoBackLink="true" />
                <div class="beerOpenerContainer">
                    <img :src="beerOpenerSrc" class="beerOpenerImg" />
                    <a href="https://www.youtube.com/watch?v=10j-cfohGzk" target="_blank">
                        <IonButton>Film instruktażowy</IonButton>
                    </a>
                </div>
            </main> 
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    methods: {
    }
}
</script>

<style scoped>
.beerOpenerContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    margin-top: 15px;
}
.beerOpenerImg {
    width: 100%;
    height: auto;
    max-width: 250px;
    margin: 0 auto;
    /* margin-top: 20px; */
}
</style>
