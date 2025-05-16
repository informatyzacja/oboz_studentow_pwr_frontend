<script setup>
import beerOpenerSrc from '@/assets/opener.jpg';
import { IonPage, IonContent, IonButton} from '@ionic/vue';
import TopBar from '../components/navigation/TopBar.vue';



</script>


<template>
    <ion-page>
        <ion-content :fullscreen = "false">
            <main>

                <TopBar title="Beer" :autoBackLink="true"/>

                <div id="BOc">

                <img :src = "beerOpenerSrc" class="BOimage"/>

                    <a href="https://www.youtube.com/watch?v=2enY9Ug1gOA&pp=ygUYb3BwZW5pbmcgYmVlciB3aXRoIHBob25l0gcJCY0JAYcqIYzv" target="_blank">
                        <IonButton>instrukcja użycia</IonButton>
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

.BOimage{
    width: 100%;
    height: auto;
    max-width: 250px;
    margin-top: 20px;

}

#BOc{
    gap: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>