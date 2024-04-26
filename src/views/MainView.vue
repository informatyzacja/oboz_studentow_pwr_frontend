<script setup>
import NavigationBar from '@/components/navigation/NavigationBar.vue'

import moment from 'moment'
import 'moment/dist/locale/pl'
import { IonRouterOutlet, IonTabs, IonPage } from '@ionic/vue';
moment.locale('pl')

</script>

<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <NavigationBar ref="navigationBar" />
        </ion-tabs>
    </ion-page>
</template>