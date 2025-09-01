import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// 1. O caminho para a firebaseConfig foi corrigido de ../../ para ../../../
import { db, auth } from '../../../firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

// Dados de exemplo
const MOCK_PROJECTS = [
    { id: 'mock1', title: 'Website Corporativo Moderno', category: 'Desenvolvimento Web', budget: '5.000' },
    { id: 'mock2', title: 'App de Delivery (iOS e Android)', category: 'Desenvolvimento Mobile', budget: '15.000' },
    { id: 'mock3', title: 'Design de Logo e Identidade Visual', category: 'Design Gráfico', budget: '2.500' },
];

export default function ProposalsScreen() {
    const navigation = useNavigation();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const q = query(collection(db, "projects"));
            const querySnapshot = await getDocs(q);
            const allProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Usando os dados de exemplo por enquanto
            setProjects(MOCK_PROJECTS);
            setIsLoading(false);
        };
        fetchProjects();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Projetos Disponíveis</Text>
            </View>
            <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                     <View style={styles.projectCard}>
                        <Text style={styles.projectTitle}>{item.title}</Text>
                        <Text style={styles.projectCategory}>{item.category}</Text>
                        <Text style={styles.projectBudget}>Orçamento: R$ {item.budget}</Text>
                         <TouchableOpacity style={styles.proposalButton}>
                            <Text style={styles.proposalButtonText}>Enviar Proposta</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>{isLoading ? 'A procurar projetos...' : 'Nenhum projeto disponível no momento.'}</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    projectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    projectTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    projectCategory: { color: '#6B7280', marginVertical: 8 },
    projectBudget: { fontWeight: 'bold', color: '#16A34A', fontSize: 16 },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6B7280' },
    proposalButton: {
        marginTop: 15,
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    proposalButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

