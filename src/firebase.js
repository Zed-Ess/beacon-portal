import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyCdab2VP0D5uLg8Q8jPBSXMPtDs1ljtzec",
  authDomain:        "beacon-educational-consult.firebaseapp.com",
  projectId:         "beacon-educational-consult",
  storageBucket:     "beacon-educational-consult.firebasestorage.app",
  messagingSenderId: "969008066460",
  appId:             "1:969008066460:web:415dd5a324afe34b8fa259"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
