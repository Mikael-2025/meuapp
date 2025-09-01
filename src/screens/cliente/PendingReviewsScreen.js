import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Componente para um cartão de avaliação pendente
const PendingReviewCard = ({ item }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.projectCard}>
            <Text style={styles.projectTitle}>{item.title}</Text>
            <Text style={styles.projectInfo}>Trabalho concluído por {item.professional}</Text>
            <TouchableOpacity 
                style={styles.reviewButton} 
                onPress={() => navigation.navigate('Avaliacao', { 
                    projectId: item.id, 
                    professionalName: item.professional 
                })}
            >
                <Text style={styles.reviewButtonText}>Avaliar Agora</Text>
            </TouchableOpacity>
        </View>
    );
};

export default function PendingReviewsScreen() {
    const [pendingProjects, setPendingProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused(); // Para recarregar a tela quando o utilizador volta a ela

    useEffect(() => {
        const fetchPendingReviews = async () => {
            const user = auth.currentUser;
            if (user) {
                // Esta query busca todos os projetos do utilizador que estão "Concluídos"
                // Para uma lógica mais avançada, adicionaríamos um campo 'avaliado: false'
                const q = query(
                    collection(db, "projects"), 
                    where("clientId", "==", user.uid),
                    where("status", "==", "Concluído") 
                );
                const querySnapshot = await getDocs(q);
                const projectsToReview = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPendingProjects(projectsToReview);
            }
            setIsLoading(false);
        };

        // Apenas busca os dados se a tela estiver visível
        if (isFocused) {
            fetchPendingReviews();
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Avaliações Pendentes</Text>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={pendingProjects}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PendingReviewCard item={item} />}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Você não tem nenhuma avaliação pendente.</Text>
                            <Text style={styles.emptySubText}>Todas as suas avaliações estão em dia!</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
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
    },
    projectTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    projectInfo: { color: '#6B7280', marginBottom: 15, fontSize: 16 },
    reviewButton: {
        backgroundColor: '#FBBF24',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    reviewButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40%',
    },
    emptyText: { 
        fontSize: 18, 
        fontWeight: '600',
        color: '#6B7280',
    },
    emptySubText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
    }
});
