import { getToken } from "firebase/messaging";
import { messaging } from "@/firebase/firebase";

export async function getFCMToken() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey:
        "BDBDkoAQDBpNegx9nDiMMPaJ9jZ7d7Sd3mF9N4SvzOyOwTyUF8f6dTLhP6SzD32vvQkITBYoBO6qpjsLtJILpOc",
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (error) {
    console.error("FCM Error:", error);
    return null;
  }
}