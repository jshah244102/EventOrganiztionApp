// Add this import:
import AsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBa0o-hLCrDvmCxy8KueC-iKve17LusiOs",
  authDomain: "eventorganiztionapp.firebaseapp.com",
  projectId: "eventorganiztionapp",
  storageBucket: "eventorganiztionapp.firebasestorage.app",
  messagingSenderId: "816796353012",
  appId: "1:816796353012:web:39b0d8906699bbcaf979a1"
};

const app = initializeApp(firebaseConfig);

// Initialize auth with persistence enabled for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, db, auth };
