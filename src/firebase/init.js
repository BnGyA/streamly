import firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD6eKGvT2Pe9jfgckwJFHbC2I3DXB_LhXg",
    authDomain: "streamly-b3b64.firebaseapp.com",
    databaseURL: "https://streamly-b3b64.firebaseio.com",
    projectId: "streamly-b3b64",
    storageBucket: "streamly-b3b64.appspot.com",
    messagingSenderId: "225676625012",
    appId: "1:225676625012:web:8069bc8380bf889d5b7d21"
};
const firebaseApp = firebase.initializeApp(config);


/// export firestore database
export default firebaseApp.firestore() 