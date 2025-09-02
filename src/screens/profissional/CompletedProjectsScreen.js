import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

// Dados de exemplo para o histórico
const MOCK_COMPLETED_PROJECTS = [
    { id: '1', title: 'Desenvolvimento de App Mobile', clientName: 'Ana Ferreira', amount: '12.000,00', date: '28/08/2025' },
    { id: '2', title: 'Criação de Website', clientName: 'Carlos Souza', amount: '4.500,00', date: '25/08/2025' },
    { id: '3', title: 'Manutenção de E-commerce', clientName: 'Juliana Costa', amount: '1.500,00', date: '22/08/2025' },
];

// Componente para um cartão de projeto concluído
const CompletedProjectCard = ({ item }) => (
    <View style={styles.projectCard}>
        <Icon name="concluido" style={styles.projectIcon} />
        <View style={styles.projectDetails}>
            <Text style={styles.projectTitle}>{item.title}</Text>
            <Text style={styles.projectClient}>Cliente: {item.clientName}</Text>
            <Text style={styles.projectDate}>Finalizado em: {item.date}</Text>
        </View>
        <Text style={styles.projectAmount}>+ R$ {item.amount}</Text>
    </View>
);

export default function CompletedProjectsScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="voltar" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Projetos Concluídos</Text>
                <View style={{ width: 30 }} />
            </View>

            <FlatList
                data={MOCK_COMPLETED_PROJECTS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <CompletedProjectCard item={item} />}
                contentContainerStyle={{ padding: 20 }}
            />
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
    projectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    projectIcon: {
        width: 24,
        height: 24,
        tintColor: '#16A34A',
        marginRight: 15,
    },
    projectDetails: {
        flex: 1,
    },
    projectTitle: {
        fontWeight: 'bold',
        color: '#1F2937',
        fontSize: 16,
    },
    projectClient: {
        color: '#6B7280',
        fontSize: 14,
        marginVertical: 2,
    },
    projectDate: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    projectAmount: {
        color: '#16A34A',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
