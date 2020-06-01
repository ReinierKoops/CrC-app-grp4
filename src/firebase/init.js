import * as firebase from 'firebase';
import 'firebase/firestore';

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDR-DbJbf3xVEO-5myX9_UJfshF1KG6o3c",
    authDomain: "crc-party-app-eu.firebaseapp.com",
    databaseURL: "https://crc-party-app-eu.firebaseio.com",
    projectId: "crc-party-app-eu",
    storageBucket: "crc-party-app-eu.appspot.com",
    messagingSenderId: "678872990969",
    appId: "1:678872990969:web:165a7a6f189c50d1ab8e28",
    measurementId: "G-PQ673Z4K75"
  };

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore();

export default { firebaseApp, db };
