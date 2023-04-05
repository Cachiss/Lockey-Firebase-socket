// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc, doc } from "firebase/firestore";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const firebaseConfig = JSON.parse(fs.readFileSync(join(__dirname, '..', 'lockey_firebase.json'), 'utf8'));
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));

  return querySnapshot.docs.map(doc => {
    //convert string to number example
    const {name, email, password} = doc.data();
    const hash = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
      if(err) throw err;
      return hash;
    });
    return {
      id: doc.id,
      name,
      email,
      password: hash
    }
  });

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

