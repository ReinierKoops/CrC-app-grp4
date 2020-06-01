import firebase from 'firebase'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC3VJYI8qWbz5Y93ZiCk0ySYnf6r5CVHpg",
  authDomain: "crc-party-grp4.firebaseapp.com",
  databaseURL: "https://crc-party-grp4.firebaseio.com",
  projectId: "crc-party-grp4",
  storageBucket: "crc-party-grp4.appspot.com",
  messagingSenderId: "582616103815",
  appId: "1:582616103815:web:2dcf0d20daa3681e62b122"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore()
