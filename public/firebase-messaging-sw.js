importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBrtDPP89thNhhFHLjn7Uc9uHPf1pL-_I4",
  authDomain: "orms-notification.firebaseapp.com",
  projectId: "orms-notification",
  storageBucket: "orms-notification.firebasestorage.app",
  messagingSenderId: "638111193886",
  appId: "1:638111193886:web:117c18a059768c87aac70f"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

self.addEventListener("notificationclick", (event) => {

    event.notification.close();

    event.waitUntil(
      clients.openWindow(`${self.location.origin}/orders`)
    );
});

// messaging.onBackgroundMessage((payload) => {
//   console.log("Background Message:", payload);

//   self.registration.showNotification(
//     payload.notification?.title || "Notification",
//     {
//       body: payload.notification?.body || "",
//       icon: "/icon-512.png"
//     }
//   );
// });

