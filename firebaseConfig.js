// Importe as funções do SDK do Firebase de que precisa
import { initializeApp, getApps, getApp } from "firebase/app";
// Adicione as importações para a inicialização de Auth e AsyncStorage
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// A sua configuração da web app do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCbs7Cw_Z8_YJ2FHaruR5HeSTKnfT-2SqQ", // IMPORTANTE: Coloque a sua chave de API real aqui
  authDomain: "obramo.firebaseapp.com",
  projectId: "obramo",
  storageBucket: "obramo.firebasestorage.com",
  messagingSenderId: "187006525723",
  appId: "1:187006525723:web:b495fdf74b2ba53a4a73be",
};

// Inicialização segura para evitar re-inicialização em React Native
let app;
if (getApps().length === 0) {
  // Se nenhuma app Firebase foi inicializada, inicialize uma.
  app = initializeApp(firebaseConfig);
} else {
  // Se já existir uma, apenas obtenha a referência a ela.
  app = getApp();
}

// Inicialize o Auth com a persistência do AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

// Exporte as constantes para serem usadas noutras partes da sua aplicação
export { auth, db };
