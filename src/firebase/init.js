import firebase from 'firebase'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA4Djro0NVy_DeLho-hADhE3Z86ikTLsU8",
  authDomain: "crc-party-app.firebaseapp.com",
  databaseURL: "https://crc-party-app.firebaseio.com",
  projectId: "crc-party-app",
  storageBucket: "crc-party-app.appspot.com",
  messagingSenderId: "804169797522",
  appId: "1:804169797522:web:86091b2390304df0e6fb4b",
  measurementId: "G-4PNXBN6EJ3"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.analytics();

export default firebaseApp.firestore()