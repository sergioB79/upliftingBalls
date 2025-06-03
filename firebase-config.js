// Firebase config and initialization for CDN usage
const firebaseConfig = {
  apiKey: "AIzaSyANpc4sfF14XeHjUPqQu5XGePiOHbe5TM4",
  authDomain: "balls-stats.firebaseapp.com",
  projectId: "balls-stats",
  storageBucket: "balls-stats.firebasestorage.app",
  messagingSenderId: "174517867925",
  appId: "1:174517867925:web:5b6bb0238d8f24490d929c",
  measurementId: "G-QLNXEGVHR4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
