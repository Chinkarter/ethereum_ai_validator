// static/js/firebase-config.js

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyByfYYb9g3yuV0Ilwv0kp6eX2on--54aF0",
    authDomain: "auth.ethaivalidators.site",
    projectId: "eth1-c3f09",
    storageBucket: "eth1-c3f09.firebasestorage.app",
    messagingSenderId: "891410320318",
    appId: "1:891410320318:web:317b53b77c592346db87ef",
    measurementId: "G-6T1MRD3S6E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
