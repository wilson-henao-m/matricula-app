// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCc0FfFcl4Lgy79ijRmAg997EDa981Y5q4",
    authDomain: "matricula-app-bf866.firebaseapp.com",
    projectId: "matricula-app-bf866",
    storageBucket: "matricula-app-bf866.firebasestorage.app",
    messagingSenderId: "72086645143",
    appId: "1:72086645143:web:0cd6141df706e07ba77cd2"
};
// const firebaseConfig = {
//   apiKey: "TU_API_KEY",
//   authDomain: "TU_AUTH_DOMAIN",
//   projectId: "TU_PROJECT_ID",
//   storageBucket: "TU_STORAGE_BUCKET",
//   messagingSenderId: "TU_MESSAGING_SENDER_ID",
//   appId: "TU_APP_ID"
// };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCc0FfFcl4Lgy79ijRmAg997EDa981Y5q4",
//   authDomain: "matricula-app-bf866.firebaseapp.com",
//   projectId: "matricula-app-bf866",
//   storageBucket: "matricula-app-bf866.firebasestorage.app",
//   messagingSenderId: "72086645143",
//   appId: "1:72086645143:web:0cd6141df706e07ba77cd2"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);