import firebase from 'firebase/app';
import "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const imageRef = storage.ref('image')

export { storage, imageRef, firebase as default}