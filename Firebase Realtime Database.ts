import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);