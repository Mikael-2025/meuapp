import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'; // Adicionei componentes para o ecrã de carregamento
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importe o auth e o db, e as funções necessárias
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


// Importe todas as suas telas
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardCliente from './src/screens/DashboardCliente';
import DashboardProfissional from './src/screens/DashboardProfissional';

const Stack = createNativeStackNavigator();

// Componente para as telas de Autenticação (Login, Cadastro)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// Componente para as telas principais da App (Dashboards)
const AppStack = ({ userType }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {userType === 'cliente' ? (
      <Stack.Screen name="DashboardCliente" component={DashboardCliente} />
    ) : (
      <Stack.Screen name="DashboardProfissional" component={DashboardProfissional} />
    )}
  </Stack.Navigator>
);

// Ecrã de carregamento simples
const SplashScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
    </View>
);

export default function App() {
  const [user, setUser] = useState(null); // Guarda o estado do utilizador (logado ou não)
  const [userType, setUserType] = useState(null); // Guarda o tipo de perfil
  const [isLoading, setIsLoading] = useState(true); // Controla o ecrã de carregamento inicial

  useEffect(() => {
    // Adicionada uma verificação para garantir que 'auth' foi importado corretamente
    if (!auth) {
        console.error("Firebase Auth não foi inicializado. Verifique o seu ficheiro firebaseConfig.js!");
        setIsLoading(false);
        return;
    }

    // 2. onAuthStateChanged é um "ouvinte" que verifica o estado do login em tempo real
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        // Se o utilizador está logado, busca os dados dele no Firestore
        const userDocRef = doc(db, "users", authenticatedUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType); // Guarda o tipo de perfil
        }
        setUser(authenticatedUser); // Guarda os dados do utilizador logado
      } else {
        // Se o utilizador fez logout
        setUser(null);
        setUserType(null);
      }
      setIsLoading(false); // Termina o carregamento
    });

    // Limpa o "ouvinte" quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  // Enquanto verifica o estado de login, mostra um ecrã de carregamento
  if (isLoading) {
    return <SplashScreen />; 
  }

  return (
    // 3. Renderiza o conjunto de telas correto com base no estado do utilizador
    <NavigationContainer>
      {user ? <AppStack userType={userType} /> : <AuthStack />}
    </NavigationContainer>
  );
}
