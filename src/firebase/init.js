import firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
console.log(process.env.API_KEY);
var config = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH,
    databaseURL: process.env.VUE_APP_URL,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE,
    messagingSenderId: process.env.VUE_APP_SENDER_ID,
    appId: process.env.VUE_APP_APP_ID
};
const firebaseApp = firebase.initializeApp(config);


/// export firestore database
export default firebaseApp.firestore() 