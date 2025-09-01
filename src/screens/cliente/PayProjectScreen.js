import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

// Dados de exemplo
const PENDING_PAYMENTS = [
    { id: '1', title: 'Website Corporativo', professional: 'Juliana Costa', amount: '4.500' },
    { id: '2', title: 'Campanha de Marketing', professional: 'Marcos Andrade', amount: '1.200' },
];

export default function PayProjectScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="voltar" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pagar Projetos</Text>
                <View style={{ width: 30 }} />
            </View>

            <FlatList
                data={PENDING_PAYMENTS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.paymentCard}>
                        <View>
                            <Text style={styles.projectTitle}>{item.title}</Text>
                            <Text style={styles.professionalName}>Profissional: {item.professional}</Text>
                        </View>
                        <View style={styles.paymentActions}>
                            <Text style={styles.amount}>R$ {item.amount}</Text>
                            {/* O botão agora navega para a nova tela, passando os dados do projeto */}
                            <TouchableOpacity 
                                style={styles.payButton}
                                onPress={() => navigation.navigate('SelectPaymentMethod', {
                                    projectId: item.id,
                                    amount: item.amount
                                })}
                            >
                                <Text style={styles.payButtonText}>Pagar Agora</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum pagamento pendente.</Text>}
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
    paymentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    projectTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    professionalName: { fontSize: 14, color: '#6B7280' },
    paymentActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    amount: { fontSize: 18, fontWeight: 'bold', color: '#10B981' },
    payButton: { backgroundColor: '#3B82F6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
    payButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6B7280' },
});

