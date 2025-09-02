import React from 'react';
// 1. O ActivityIndicator foi adicionado à importação
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../../components/Icon';

const MOCK_TRANSACTIONS = [
    { id: '1', projectName: 'Desenvolvimento de App Mobile', clientName: 'Ana Ferreira', amount: '4.000,00', date: '28/08/2025' },
    { id: '2', projectName: 'Criação de Website', clientName: 'Carlos Souza', amount: '2.000,00', date: '25/08/2025' },
];

const TransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
        <Icon name="receber" style={styles.transactionIcon} />
        <View style={styles.transactionDetails}>
            <Text style={styles.transactionProject}>{item.projectName}</Text>
            <Text style={styles.transactionClient}>Recebido de {item.clientName}</Text>
        </View>
        <Text style={styles.transactionAmount}>+ R$ {item.amount}</Text>
    </View>
);

export default function EarningsScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="voltar" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ganhos e Extrato</Text>
                <View style={{ width: 30 }} />
            </View>

            <LinearGradient
                colors={['#10B981', '#10B981']}
                style={styles.earningsCard}
            >
                <Text style={styles.earningsLabel}>Ganhos Totais (Mês)</Text>
                <Text style={styles.earningsValue}>R$ 7.800,00</Text>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Extrato Recente</Text>
                <FlatList
                    data={MOCK_TRANSACTIONS}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionItem item={item} />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backIcon: { width: 24, height: 24, tintColor: '#1F2937' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    earningsCard: {
        margin: 20,
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    earningsLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
    },
    earningsValue: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 15,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    transactionIcon: {
        width: 24,
        height: 24,
        tintColor: '#10B981',
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionProject: {
        fontWeight: 'bold',
        color: '#1F2937',
    },
    transactionClient: {
        color: '#6B7280',
        fontSize: 12,
    },
    transactionAmount: {
        color: '#10B981',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

