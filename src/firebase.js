// firebase.js
import firebase from 'firebase/app';
import 'firebase/auth'; // if using Firebase Auth
import 'firebase/firestore'; // if using Firestore
// import other Firebase services as needed

const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
