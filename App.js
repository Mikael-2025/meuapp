import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Icon from './src/components/Icon';
import AddServiceButton from './src/components/AddServiceButton';

// --- Importações ---
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Telas do Cliente
import DashboardCliente from './src/screens/cliente/DashboardCliente';
import ProjectsScreen from './src/screens/cliente/ProjectsScreen';
import PaymentsScreen from './src/screens/cliente/PaymentsScreen';
import CreateProjectScreen from './src/screens/cliente/CreateProjectScreen';
import FindProfessionalsScreen from './src/screens/cliente/FindProfessionalsScreen';
import ProfessionalProfileScreen from './src/screens/cliente/ProfessionalProfileScreen';
import AddCardScreen from './src/screens/cliente/AddCardScreen';
import PayProjectScreen from './src/screens/cliente/PayProjectScreen';
import InvoicesScreen from './src/screens/cliente/FaturaScreen';
import SelectPaymentMethodScreen from './src/screens/cliente/SelectPaymentMethodScreen';
import AvaliacaoScreen from './src/screens/cliente/AvaliacaoScreen';
import PendingReviewsScreen from './src/screens/cliente/PendingReviewsScreen';
import MessagesScreen from './src/screens/cliente/MessagesScreen';
import ChatScreen from './src/screens/cliente/ChatScreen';

// Telas do Profissional
import DashboardProfissional from './src/screens/profissional/DashboardProfissional';
import PostServiceScreen from './src/screens/profissional/PostServiceScreen';
import ProposalsScreen from './src/screens/profissional/ProposalsScreen';
import EarningsScreen from './src/screens/profissional/EarningsScreen';
import CompletedProjectsScreen from './src/screens/profissional/CompletedProjectsScreen';
import MyReviewsScreen from './src/screens/profissional/MyReviewsScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. A tela de verificação de email agora faz parte do fluxo de autenticação.
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
);


// --- Navegadores de Abas Separados ---
const ClientTabs = ({ route }) => {
    const { userType } = route.params;
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarStyle: { height: 60, paddingBottom: 5 },
            tabBarIcon: ({ focused }) => {
                let iconName;
                if (route.name === 'InícioCliente') iconName = 'home';
                else if (route.name === 'Projetos') iconName = 'projetos';
                else if (route.name === 'Pagamentos') iconName = 'pagamentos';
                else if (route.name === 'Mensagens') iconName = 'mensagens';
                else if (route.name === 'Perfil') iconName = 'perfil';
                return <Icon name={iconName} focused={focused} />;
            },
        })}>
            <Tab.Screen name="InícioCliente" component={DashboardCliente} options={{ title: 'Início' }} />
            <Tab.Screen name="Projetos" component={ProjectsScreen} initialParams={{ userType }} />
            <Tab.Screen name="Pagamentos" component={PaymentsScreen} initialParams={{ userType }} />
            <Tab.Screen name="Mensagens" component={MessagesScreen} initialParams={{ userType }} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const ProfessionalTabs = ({ route }) => {
    const { userType } = route.params;
    return (
         <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarStyle: { height: 60, paddingBottom: 5 },
            tabBarIcon: ({ focused }) => {
                let iconName;
                if (route.name === 'InícioProfissional') iconName = 'home';
                else if (route.name === 'Propostas') iconName = 'propostas';
                else if (route.name === 'Mensagens') iconName = 'mensagens';
                else if (route.name === 'Perfil') iconName = 'perfil';
                return <Icon name={iconName} focused={focused} />;
            },
        })}>
            <Tab.Screen name="InícioProfissional" component={DashboardProfissional} options={{ title: 'Início' }} />
            <Tab.Screen name="Propostas" component={ProposalsScreen} initialParams={{ userType }} />
            <Tab.Screen 
                name="PostServiceTab" 
                component={View} // Componente vazio
                options={{
                    tabBarButton: (props) => <AddServiceButton {...props} />,
                }}
            />
            <Tab.Screen name="Mensagens" component={MessagesScreen} initialParams={{ userType }} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
};


// --- Pilha Principal da Aplicação ---
const AppStack = ({ userType }) => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userType === 'cliente' ? (
             <Stack.Screen name="ClientRoot" component={ClientTabs} initialParams={{ userType }} />
        ) : (
             <Stack.Screen name="ProfessionalRoot" component={ProfessionalTabs} initialParams={{ userType }} />
        )}

        {/* Telas que podem ser acedidas a partir de qualquer navegador */}
        <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
        <Stack.Screen name="FindProfessionals" component={FindProfessionalsScreen} />
        <Stack.Screen name="ProfessionalProfile" component={ProfessionalProfileScreen} />
        <Stack.Screen name="AddCard" component={AddCardScreen} />
        <Stack.Screen name="PayProject" component={PayProjectScreen} />
        <Stack.Screen name="Invoices" component={InvoicesScreen} />
        <Stack.Screen name="SelectPaymentMethod" component={SelectPaymentMethodScreen} />
        <Stack.Screen name="Avaliacao" component={AvaliacaoScreen} />
        <Stack.Screen name="PendingReviews" component={PendingReviewsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="PostService" component={PostServiceScreen} />
        <Stack.Screen name="Earnings" component={EarningsScreen} />
        <Stack.Screen name="CompletedProjects" component={CompletedProjectsScreen} />
        <Stack.Screen name="MyReviews" component={MyReviewsScreen} />
    </Stack.Navigator>
);

export default function App() {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
            if (authenticatedUser) {
                await authenticatedUser.reload();
                setUser(authenticatedUser); // Guarda sempre o utilizador
                if (authenticatedUser.emailVerified) {
                    const userDocRef = doc(db, "users", authenticatedUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setUserType(userDoc.data().userType);
                    }
                    setIsEmailVerified(true);
                } else {
                    setIsEmailVerified(false);
                }
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

    // 2. A lógica de renderização foi simplificada. Se o utilizador estiver verificado, mostra o App. Senão, mostra o fluxo de autenticação.
    return (
        <NavigationContainer>
            {user && isEmailVerified ? <AppStack userType={userType} /> : <AuthStack />}
        </NavigationContainer>
    );
}

