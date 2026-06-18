import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyDP1zil06U1ACB4WRuzc3FJQhniYP7hlVM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'doculink-auth.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'doculink-auth',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'doculink-auth.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '372047876848',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:372047876848:web:bda8f1aa61da1663d7e835',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-F52BQJ385R',
}

console.log('Firebase config loaded', {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
})

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
