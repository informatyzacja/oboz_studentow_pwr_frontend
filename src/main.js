import './assets/main.css'

import { IonicVue } from '@ionic/vue';
import { SplashScreen } from '@capacitor/splash-screen';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// /* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

// /* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './assets/variables.css';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

const app = createApp(App)

app.use(IonicVue)
app.use(createPinia())
app.use(router)


import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

const addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received: ', notification);
        LocalNotifications.schedule({
            notifications: [
                {
                    title: notification.title,
                    body: notification.body,
                    id: 1,
                    sound: 'default',
                    extra: {
                        link: notification.data?.link || null,
                    },
                },
            ],
        });
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed', notification, notification.actionId, notification.inputValue);
        if (notification.actionId === 'tap' && notification.notification.data?.link) {
            router.push(notification.notification.data.link);
        }
    });

    await LocalNotifications.addListener('localNotificationActionPerformed', notification => {
        console.log('Local notification action performed', notification, notification.actionId);
        if (notification.actionId === 'tap' && notification.notification.extra?.link) {
            router.push(notification.notification.extra.link);
        }
    });

}

router.isReady().then(() => {
    app.mount('#app');
    SplashScreen.hide();
    addListeners();
});

// app.mixin({
//   methods: {
//     // Global functions
//   }
// })
