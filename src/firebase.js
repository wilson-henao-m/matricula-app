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

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
