import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { sendEmailVerification, signOut } from 'firebase/auth';

export default function VerifyEmailScreen({ navigation }) {
    // 1. O 'user' agora é obtido do auth, que é sempre seguro
    const user = auth.currentUser;

    const handleResendEmail = () => {
        if (user) {
            sendEmailVerification(user)
                .then(() => {
                    Alert.alert("Sucesso", "Um novo email de verificação foi enviado!");
                });
        }
    };

    const handleBackToLogin = () => {
        signOut(auth);
        // A navegação para AuthStack irá automaticamente mostrar a tela de Welcome
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>📧</Text>
                <Text style={styles.title}>Verifique o seu Email</Text>
                <Text style={styles.subtitle}>
                    Enviámos um link de confirmação para
                    {/* 2. Usamos o "optional chaining" (?.) para evitar o erro caso o email ainda não tenha carregado */}
                    <Text style={styles.emailText}> {user?.email}</Text>.
                    Por favor, verifique a sua caixa de entrada e a de spam.
                </Text>

                <TouchableOpacity style={styles.primaryButton} onPress={handleResendEmail}>
                    <Text style={styles.primaryButtonText}>Reenviar Email</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleBackToLogin}>
                    <Text style={styles.secondaryButtonText}>Voltar para o Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '90%',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    icon: {
        fontSize: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 30,
    },
    emailText: {
        fontWeight: 'bold',
        color: '#1F2937',
    },
    primaryButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: '600',
    },
});

