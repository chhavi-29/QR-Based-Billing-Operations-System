import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmXauEUHGJgssrPLPcfVSGzNJD0xym0ak",
  authDomain: "govigyan-billingchhavi.firebaseapp.com",
  projectId: "govigyan-billingchhavi",
  storageBucket: "govigyan-billingchhavi.firebasestorage.app",
  messagingSenderId: "744105401205",
  appId: "1:744105401205:web:b185379388280b2113513c",
  measurementId: "G-NJW0KFRT68"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };