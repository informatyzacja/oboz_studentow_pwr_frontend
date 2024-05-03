<script setup>
import TinderNavigationBar from '../../components/navigation/TinderNavigationBar.vue';

import { IonRouterOutlet, IonTabs, IonPage } from '@ionic/vue';

</script>

<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <TinderNavigationBar ref="navigationBar" />
        </ion-tabs>
    </ion-page>
</template>