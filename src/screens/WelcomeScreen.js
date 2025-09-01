import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#4F46E5', '#318cfaff']}
                style={styles.background}
            >
                <View style={styles.content}>
                    <Image 
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Bem-vindo ao Obramo!</Text>
                    <Text style={styles.subtitle}>Conectando clientes e profissionais de TI com segurança e eficiência.</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        <Text style={styles.primaryButtonText}>CRIAR CONTA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.secondaryButtonText}>JÁ TENHO UMA CONTA</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 30,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#E0E7FF',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    buttonContainer: {
        paddingBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 15,
    },
    primaryButtonText: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
