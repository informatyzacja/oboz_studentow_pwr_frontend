export const API_URL = process.env.VUE_APP_API_URL || '/api/'
const WS_API_PROTOCOL = process.env.VUE_APP_WS_API_PROTOCOL || 'wss'
export const WS_API_URL = process.env.VUE_APP_WS_API_URL || WS_API_PROTOCOL + '://' + window.location.host + '/'
// '{ "Authorization": "Token 67bdbcffd9c883b098da608f57db393c868ef178" }'
export const AUTH_TOKEN = process.env.VUE_APP_AUTH_TOKEN
export const AUTH_HEADER = AUTH_TOKEN ? { "Authorization": "Token " + AUTH_TOKEN } : {}

export const REULAMIN_LINK = 'https://drive.google.com/file/d/1Ptkf7S7XUzlGGz_j3ye1XXhOYSyecanK/view?pli=1'
export const POLITYKA_PRYWATNOSCI_LINK = null


import { getToken, isSupported } from "firebase/messaging";
import { messaging } from "./firebaseConfig.js";

import { getCookie } from './stores/functions.js'

export function registerForPushNotifications() {
    if (isSupported() && ("Notification" in window)) {
        getToken(messaging, { vapidKey: "BA4pphEFBKRtGGjjKfukpE5P4W9m4P9Sufa0et4JrKgWQ0lfyj07teD27ztP4enz0Cgv9OPm0W_4ldDS-_iWVmE" }).then((currentToken) => {
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
            alert('Pojawił się błąd podczas włączania powiadomień')
            return err;
            // ...
        });
    }
}