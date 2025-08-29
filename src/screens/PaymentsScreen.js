import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

// --- Ícones (Placeholders) ---
const Icon = ({ name }) => {
    const icons = { 'pix': '❖', 'boleto': '|||', 'fatura': '📄', 'up': '⬆️', 'down': '⬇️' };
    return <Text style={styles.quickActionIcon}>{icons[name] || '❓'}</Text>;
};

// --- Componentes Reutilizáveis ---
const QuickActionButton = ({ icon, label }) => (
    <TouchableOpacity style={styles.quickActionButton}>
        <Icon name={icon} />
        <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
);

const TransactionRow = ({ icon, title, subtitle, amount, time }) => (
    <View style={styles.transactionRow}>
        <View style={styles.transactionIconContainer}>
            <Icon name={icon} />
        </View>
        <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>{title}</Text>
            <Text style={styles.transactionSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.transactionAmountContainer}>
            <Text style={styles.transactionAmount}>{amount}</Text>
            <Text style={styles.transactionTime}>{time}</Text>
        </View>
    </View>
);

export default function PaymentsScreen({ navigation }) {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name);
                }
            }
        };
        fetchUserData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Olá, {userName.split(' ')[0]}</Text>
                    </View>
                    <Image source={{ uri: 'https://placehold.co/100x100/ffffff/4F46E5?text=A' }} style={styles.avatar} />
                </View>

                {/* Meus Cartões - MODIFICADO */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meus cartões</Text>
                    {/* Botão simples para adicionar cartão */}
                    <TouchableOpacity 
                        style={styles.addCardButton}
                        onPress={() => navigation.navigate('AddCard')}
                    >
                        <Text style={styles.addCardButtonText}>+ Adicionar Cartão</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Pagamentos Pendentes */}
                <View style={styles.pendingPaymentsBanner}>
                    <Text style={styles.pendingPaymentsText}>Você tem 7 pagamentos pendentes</Text>
                    <TouchableOpacity><Text style={styles.pendingPaymentsLink}>Ver agora</Text></TouchableOpacity>
                </View>

                {/* Ações Rápidas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Um clique de distância</Text>
                    <View style={styles.quickActionsContainer}>
                        <QuickActionButton icon="pix" label="Área Pix" />
                        <QuickActionButton icon="boleto" label="Pagamentos" />
                        <QuickActionButton icon="fatura" label="Fatura" />
                    </View>
                </View>

                {/* Últimos Pagamentos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Últimos pagamentos</Text>
                    <View style={styles.transactionsCard}>
                        <TransactionRow icon="up" title="Farmácia" subtitle="Cartão final 1234" amount="R$ 30,00" time="19h52" />
                        <View style={styles.divider} />
                        <TransactionRow icon="up" title="Subway" subtitle="Pix enviado" amount="R$ 50,00" time="12h20" />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#4F46E5' },
    greeting: { color: '#E0E7FF', fontSize: 16 },
    balance: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    section: { marginTop: 20, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 10 },
    // Estilos para o novo botão de adicionar cartão
    addCardButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4F46E5',
    },
    addCardButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '600',
    },
    pendingPaymentsBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 15, marginHorizontal: 20, borderRadius: 12, marginTop: 20 },
    pendingPaymentsText: { color: '#D97706', fontWeight: '600' },
    pendingPaymentsLink: { color: '#D97706', fontWeight: 'bold', textDecorationLine: 'underline' },
    quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    quickActionButton: { backgroundColor: '#F3F4F6', borderRadius: 16, padding: 20, alignItems: 'center', width: 100, height: 100, justifyContent: 'center' },
    quickActionIcon: { fontSize: 24, color: '#4B5563' },
    quickActionLabel: { marginTop: 8, color: '#4B5563', fontWeight: '600' },
    transactionsCard: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 10 },
    transactionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    transactionIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    transactionDetails: { flex: 1 },
    transactionTitle: { fontSize: 16, fontWeight: 'bold' },
    transactionSubtitle: { color: '#6B7280' },
    transactionAmountContainer: { alignItems: 'flex-end' },
    transactionAmount: { fontSize: 16, fontWeight: 'bold' },
    transactionTime: { color: '#9CA3AF' },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 5 },
});
