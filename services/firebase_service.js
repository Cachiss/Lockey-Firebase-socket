// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';


const __dirname = dirname(fileURLToPath(import.meta.url));
const firebaseConfig = JSON.parse(fs.readFileSync(join(__dirname, '..', 'lockey_firebase.json'), 'utf8'));
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  //print users in a json
  return querySnapshot.docs.map(doc => doc.data());
};

export const deleteUser = async (id) => {
  await deleteDoc(doc(db, "users", id));
}

export const updateUser = async (id, data) => {
  await updateDoc(doc(db, "users", id), data);
}

export const createUser = async (data) => {
  await addDoc(collection(db, "users"), data);
}


