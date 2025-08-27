import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Importe todas as suas telas
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardCliente from './src/screens/DashboardCliente';
import DashboardProfissional from './src/screens/DashboardProfissional';
import ProfileScreen from './src/screens/ProfileScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import CreateProjectScreen from './src/screens/CreateProjectScreen'; // Importe a nova tela

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const HomeScreen = ({ route }) => {
    const { userType } = route.params;
    return userType === 'cliente' ? <DashboardCliente /> : <DashboardProfissional />;
}

// Navegador de Abas principal
const AppTabs = ({ route }) => {
    const { userType } = route.params;
    return (
        <Tab.Navigator screenOptions={{ 
            headerShown: false,
            tabBarActiveTintColor: '#4F46E5',
            tabBarInactiveTintColor: '#9CA3AF',
            }}>
            <Tab.Screen name="Início" component={HomeScreen} initialParams={{ userType }} />
            <Tab.Screen name="Projetos" component={ProjectsScreen} initialParams={{ userType }} />
            <Tab.Screen name="Mensagens" component={View} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

// Navegador de Pilha que contém as Abas e outras telas
const AppStack = ({ userType }) => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AppTabs" component={AppTabs} initialParams={{ userType }} />
        <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
    </Stack.Navigator>
);


export default function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        const userDocRef = doc(db, "users", authenticatedUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType);
        }
        setUser(authenticatedUser);
      } else {
        setUser(null);
        setUserType(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>; 
  }

  return (
    <NavigationContainer>
      {user ? <AppStack userType={userType} /> : <AuthStack />}
    </NavigationContainer>
  );
}
