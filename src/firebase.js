import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBNa7ySa94qIpE-wu55lsK4_Ory0k-4wGI",
    authDomain: "filey-e474b.firebaseapp.com",
    projectId: "filey-e474b",
    storageBucket: "filey-e474b.appspot.com",
    messagingSenderId: "288769568465",
    appId: "1:288769568465:web:774d55b075960437bddff0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage};