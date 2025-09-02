<script setup>
import BerealNavigationBar from './components/BerealNavigationBar.vue'

import moment from 'moment'
import 'moment/dist/locale/pl'
import { IonRouterOutlet, IonTabs, IonPage } from '@ionic/vue';
moment.locale('pl')

</script>

<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <BerealNavigationBar ref="navigationBar" />
        </ion-tabs>
    </ion-page>
</template>