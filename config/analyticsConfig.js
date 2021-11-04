// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFHn-1tU8hGcBmTaM6Nc8y6LEy7ysDLns",
  authDomain: "plutus-80602.firebaseapp.com",
  projectId: "plutus-80602",
  storageBucket: "plutus-80602.appspot.com",
  messagingSenderId: "145591051590",
  appId: "1:145591051590:web:ba6dc342489c059cfcf147",
  measurementId: "G-Z75LLV2JHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);