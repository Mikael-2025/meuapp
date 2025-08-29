import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Icon from './src/components/Icon';

// 1. Importe a nova tela de Boas-Vindas
import WelcomeScreen from './src/screens/WelcomeScreen'; 
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardCliente from './src/screens/DashboardCliente';
import DashboardProfissional from './src/screens/DashboardProfissional';
import ProfileScreen from './src/screens/ProfileScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import CreateProjectScreen from './src/screens/CreateProjectScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ChatScreen from './src/screens/ChatScreen';
import PaymentsScreen from './src/screens/PaymentsScreen';
import AddCardScreen from './src/screens/AddCardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 2. Modifique o AuthStack para incluir a tela de Boas-Vindas
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const HomeScreen = ({ route }) => {
    const { userType } = route.params;
    return userType === 'cliente' ? <DashboardCliente /> : <DashboardProfissional />;
}

const AppTabs = ({ route }) => {
    const { userType } = route.params;
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#4F46E5',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarIcon: ({ focused }) => {
                let iconName;
                if (route.name === 'Início') iconName = 'home';
                else if (route.name === 'Projetos') iconName = 'projetos';
                else if (route.name === 'Pagamentos') iconName = 'pagamentos';
                else if (route.name === 'Mensagens') iconName = 'mensagens';
                else if (route.name === 'Perfil') iconName = 'perfil';
                return <Icon name={iconName} focused={focused} />;
            },
        })}>
            <Tab.Screen name="Início" component={HomeScreen} initialParams={{ userType }} />
            <Tab.Screen name="Projetos" component={ProjectsScreen} initialParams={{ userType }} />
            <Tab.Screen name="Pagamentos" component={PaymentsScreen} />
            <Tab.Screen name="Mensagens" component={MessagesScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const AppStack = ({ userType }) => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AppTabs" component={AppTabs} initialParams={{ userType }} />
        <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="AddCard" component={AddCardScreen} />
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
