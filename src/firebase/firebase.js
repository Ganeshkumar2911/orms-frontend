import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBrtDPP89thNhhFHLjn7Uc9uHPf1pL-_I4",
  authDomain: "orms-notification.firebaseapp.com",
  projectId: "orms-notification",
  storageBucket: "orms-notification.firebasestorage.app",
  messagingSenderId: "638111193886",
  appId: "1:638111193886:web:117c18a059768c87aac70f"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);