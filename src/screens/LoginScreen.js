import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { auth } from '../../firebaseConfig';
// 1. Importe a função de login
import { signInWithEmailAndPassword } from 'firebase/auth';

const { width: screenWidth } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 2. A função de login foi atualizada
    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha o email e a senha.");
            return;
        }
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // 3. Verifique se o email do utilizador foi confirmado
                if (user.emailVerified) {
                    // Se estiver verificado, o `onAuthStateChanged` no App.js irá tratar do resto
                } else {
                    // Se não estiver verificado, mostre um alerta e não deixe o utilizador entrar
                    Alert.alert(
                        "Email não verificado",
                        "Por favor, verifique a sua caixa de entrada e clique no link de confirmação para ativar a sua conta."
                    );
                    auth.signOut(); // Deslogue o utilizador para que ele não fique num estado "meio logado"
                }
            })
            .catch(error => Alert.alert("Erro no Login", error.message))
            .finally(() => setIsLoading(false));
    };

    const curvePath = `M0,0 L0,150 Q${screenWidth / 2},220 ${screenWidth},150 L${screenWidth},0 Z`;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
                    <Path d={curvePath} fill="#4F46E5" />
                </Svg>
                 <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Welcome')}>
                    <Text style={styles.backButtonText}>{''}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />

                <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={isLoading}>
                    <Text style={styles.primaryButtonText}>{isLoading ? 'Entrando...' : 'ENTRAR'}</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Não tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.footerLink}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    headerContainer: { height: 200 },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 1 },
    backButtonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
    formContainer: { 
        flex: 1,
        paddingHorizontal: 30, 
        marginTop: -50,
        backgroundColor: '#FFFFFF', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30,
        paddingTop: 30,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 20 },
    input: { backgroundColor: '#F3F4F6', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10, marginBottom: 15, fontSize: 16 },
    primaryButton: { backgroundColor: '#4F46E5', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, },
    footerText: { fontSize: 14, color: '#6B7280' },
    footerLink: { fontSize: 14, color: '#3B82F6', fontWeight: 'bold' },
});

