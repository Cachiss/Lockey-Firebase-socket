import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
  dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(fs.readFileSync(join(__dirname, '..', 'lockey-2421a-firebase-adminsdk-fbghl-f33bd62411.json'), 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

export const listAllUsersAuth = async() => {
  const {users} = await admin.auth().listUsers();
  return users;
}


