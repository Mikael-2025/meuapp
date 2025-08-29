import React, { useState } from 'react';
// 1. Importe o 'Dimensions' para obter o tamanho da tela
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, Dimensions } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Svg, { Path } from 'react-native-svg';

// 2. Obtenha a largura da tela do dispositivo
const { width: screenWidth } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha o email e a senha.");
            return;
        }
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .catch(error => {
                Alert.alert("Erro no Login", "O email ou a senha estão incorretos.");
                console.error(error);
            })
            .finally(() => setIsLoading(false));
    };

    // 3. Crie a string do caminho da curva dinamicamente com a largura da tela
    const curvePath = `M0,0 L0,200 Q${screenWidth / 2},280 ${screenWidth},200 L${screenWidth},0 Z`;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
                    <Path
                        d={curvePath} // 4. Use o caminho dinâmico aqui
                        fill="#3B82F6"
                    />
                </Svg>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={isLoading}>
                    <Text style={styles.primaryButtonText}>{isLoading ? 'A entrar...' : 'ENTRAR'}</Text>
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
    headerContainer: {
        height: '35%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
    },
    formContainer: {
        flex: 1,
        padding: 30,
        marginTop: -50,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#F3F4F6',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    primaryButton: {
        backgroundColor: '#3B82F6',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    footerLink: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: 'bold',
    },
});

