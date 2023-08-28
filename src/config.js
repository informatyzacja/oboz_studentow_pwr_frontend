export const API_URL = import.meta.env.VITE_API_URL || '/api/'
export const WS_API_URL = import.meta.env.VITE_WS_API_URL || (import.meta.env.VITE_WS_API_PROTOCOL || 'ws') + '://' + window.location.host + '/'
export const AUTH_HEADER = JSON.parse(import.meta.env.VITE_AUTH_HEADER || '{}')

export const REULAMIN_LINK = 'https://e-2-e.eu/pl_pl/terms-and-conditions/'
export const POLITYKA_PRYWATNOSCI_LINK = 'https://e-2-e.eu/pl_pl/privacy-policy/'


import { getToken, isSupported } from "firebase/messaging";
import { messaging } from "./firebaseConfig.js";

import { getCookie } from './stores/functions.js'

export function registerForPushNotifications() {
    if (isSupported() && ("Notification" in window)) {
        getToken(messaging, {vapidKey: "BA4pphEFBKRtGGjjKfukpE5P4W9m4P9Sufa0et4JrKgWQ0lfyj07teD27ztP4enz0Cgv9OPm0W_4ldDS-_iWVmE"}).then((currentToken) => {
            if (currentToken) {
                
                const body = { token: currentToken }
                const csrftoken = getCookie('csrftoken')
                fetch(API_URL + '../api2/register-fcm-token/', {
                    headers: Object.assign(
                    {},
                    { 'Content-type': 'application/json; charset=UTF-8', 'X-CSRFToken': csrftoken },
                    AUTH_HEADER
                    ),
                    method: 'POST',
                    body: JSON.stringify(body)
                })
                .then((data) => {
                    if (data.ok) {
                        return data.json()
                    }
                    if (data.status === 403) {
                        window.location.href = '/login/?next=' + window.location.pathname
                    }
                    throw new Error(data.status + ' ' + data.statusText)
                })
                .then((data) => {
                    return data.success;
                })
                .catch((error) => {
                    console.error('There was an error!', error)
                    return error
                })

            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                return 'No registration token available. Request permission to generate one.';
                // ...
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            alert('Pojawił się error podczas włączania powiadomień')
            return err;
            // ...
        });
    }
}