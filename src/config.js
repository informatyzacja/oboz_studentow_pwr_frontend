export const API_URL = import.meta.env.VITE_API_URL
export const WS_API_URL = import.meta.env.VITE_WS_API_URL

export const REGULAMIN_LINK = 'https://d1ll4kxfi4ofbm.cloudfront.net/file/user/event_files/896284/552dfd44487d0524320f076e97e0bdff.pdf'
export const POLITYKA_PRYWATNOSCI_LINK = null

import { FCM } from '@capacitor-community/fcm';
import { PushNotifications } from '@capacitor/push-notifications'

import { toastController } from '@ionic/vue'

import { apiRequest } from './stores/functions.js'

export async function registerForPushNotifications() {
    try {
        await PushNotifications.requestPermissions();
        await PushNotifications.register();

        const token = await FCM.getToken();
        console.log('FCM token:', token);

        const body = { token: token.token }
        const data = await apiRequest('../api2/register-fcm-token/',
            'POST',
            body
        )
        if (!data.success) {
            throw new Error('Failed to register FCM token')
        }
        return data

    } catch (error) {
        console.error('Error while turning on notifications:', error);

        toastController.create({
            message: 'Nie udało się włączyć powiadomień',
            duration: 1500,
            position: 'top',
            color: 'danger'
        }).then(toast =>
            toast.present()
        );
    }
}