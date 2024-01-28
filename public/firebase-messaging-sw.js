/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyC_LWLP29VYXUD3Yfa4rc0lrM3cv1-NwiE",
  authDomain: "oboz-studentow-pwr.firebaseapp.com",
  projectId: "oboz-studentow-pwr",
  storageBucket: "oboz-studentow-pwr.appspot.com",
  messagingSenderId: "229169791903",
  appId: "1:229169791903:web:c0cbf77fbc4c7ac8e8f3aa",
  measurementId: "G-2XRD61389Y"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  if (navigator.setAppBadge) {
    navigator.setAppBadge(navigator.appBadge + 1);
  }

  //   const notificationTitle = payload.notification.title;
  //   const notificationOptions = {
  //     body: payload.notification.body
  //   };

  //   self.registration.showNotification(notificationTitle,
  //     notificationOptions);
});