import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbE5Z0GZixAm5_kdAn5X1xD_JsNmgRByk",
    authDomain: "clone-45b68.firebaseapp.com",
    projectId: "clone-45b68",
    storageBucket: "clone-45b68.appspot.com",
    messagingSenderId: "41477140349",
    appId: "1:41477140349:web:d68ba559d9fd7b55012614",
    measurementId: "G-WQ15GQ0DZW"
  };

  //initializing 
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export {db, auth};