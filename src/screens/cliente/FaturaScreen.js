import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

// Dados de exemplo
const INVOICES = [
    { id: '1', project: 'Website Corporativo', date: '25/08/2025', amount: '4.500', status: 'Pago' },
    { id: '2', project: 'App Mobile', date: '15/07/2025', amount: '12.000', status: 'Pago' },
    { id: '3', project: 'Design de Logo', date: '01/06/2025', amount: '2.500', status: 'Pago' },
];

export default function FaturaScreen(){
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="voltar" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Minhas Faturas</Text>
                <View style={{ width: 30 }} />
            </View>

            <FlatList
                data={INVOICES}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.invoiceCard}>
                        <Icon name="fatura" style={styles.invoiceIcon} />
                        <View style={styles.invoiceDetails}>
                            <Text style={styles.projectTitle}>{item.project}</Text>
                            <Text style={styles.invoiceDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.amount}>R$ {item.amount}</Text>
                    </View>
                )}
                contentContainerStyle={{ padding: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
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
    invoiceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    invoiceIcon: {
        width: 24,
        height: 24,
        tintColor: '#3B82F6',
        marginRight: 15,
    },
    invoiceDetails: { flex: 1 },
    projectTitle: { fontSize: 16, fontWeight: 'bold' },
    invoiceDate: { fontSize: 14, color: '#6B7280' },
    amount: { fontSize: 16, fontWeight: 'bold' },
});
