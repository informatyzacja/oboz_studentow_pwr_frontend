<script setup>
import beerOpenerSrc from '@/assets/owieraczdopiwa.jpg';
import { IonPage, IonContent } from '@ionic/vue';
import TopBar from '../components/navigation/TopBar.vue';
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <TopBar title="Piwo to moje paliwo"
                :autoBackLink="true"/>
                <div class="beerOpenerContainer">
                    <img :src="beerOpenerSrc" class="beerOpenerImg" />
                    <ion-button><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">Film instruktarzowy</a></ion-button>
                
                </div>
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return{
            beerOpenerSrc: ""
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
}
.beerOpenerImg {
    width: 100%;
    height: auto;
    max-width: 250px;
    margin: 0 auto;

}
</style>