import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Icon from '../../components/Icon';

const MOCK_PROJECTS = [
    { id: 'mock1', title: 'Website Corporativo Moderno', category: 'Desenvolvimento Web', budget: '5.000', status: 'Concluído', professional: 'Ana Pereira', progress: 100 },
    { id: 'mock2', title: 'App de Delivery (iOS e Android)', category: 'Desenvolvimento Mobile', budget: '15.000', status: 'Em Andamento', professional: 'Ricardo Silva', progress: 45 },
];

// O cartão de projeto agora inclui a barra de progresso
const ProjectCard = ({ item }) => {
    const navigation = useNavigation();
    const isCompleted = item.status === 'Concluído';

    return (
        <View style={styles.projectCard}>
            <View style={styles.projectHeader}>
                <Text style={styles.projectTitle}>{item.title}</Text>
                <Text style={[styles.statusBadge, styles[`status${item.status?.replace(' ', '')}`]]}>{item.status}</Text>
            </View>
            <Text style={styles.projectInfo}>com {item.professional}</Text>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress}% Completo</Text>
            {isCompleted && (
                <TouchableOpacity 
                    style={styles.reviewButton} 
                    onPress={() => navigation.navigate('Avaliacao', { 
                        projectId: item.id, 
                        professionalName: item.professional 
                    })}
                >
                    <Text style={styles.reviewButtonText}>Avaliar Profissional</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};


// --- Vista para o Cliente ---
const ClientProjectsView = () => {
    const navigation = useNavigation();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, "projects"), where("clientId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(userProjects);
            }
            setIsLoading(false);
        };
        fetchProjects();
    }, []);

    const displayProjects = !isLoading && projects.length === 0 ? MOCK_PROJECTS : projects;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meus Projetos</Text>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('FindProfessionals')}
                >
                    <Icon name="profissionais" style={styles.buttonIcon} />
                    <Text style={styles.actionButtonText}>Buscar Profissional</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('CreateProject')}
                >
                    <Icon name="plus" style={styles.buttonIcon} />
                    <Text style={styles.actionButtonText}>Postar Projeto</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={displayProjects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProjectCard item={item} />}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
                ListEmptyComponent={<Text style={styles.emptyText}>{isLoading ? 'A carregar projetos...' : 'Você ainda não postou nenhum projeto.'}</Text>}
            />
        </View>
    );
};

// --- Vista para o Profissional (agora completa) ---
const ProfessionalProjectsView = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const q = query(collection(db, "projects"));
            const querySnapshot = await getDocs(q);
            const allProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(allProjects);
            setIsLoading(false);
        };
        fetchProjects();
    }, []);

    const displayProjects = !isLoading && projects.length === 0 ? MOCK_PROJECTS : projects;

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <Text style={styles.headerTitle}>Projetos Disponíveis</Text>
            </View>
            <FlatList
                data={displayProjects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                     <View style={styles.projectCard}>
                        <Text style={styles.projectTitle}>{item.title}</Text>
                        <Text style={styles.projectInfo}>Orçamento: R$ {item.budget}</Text>
                         <TouchableOpacity style={styles.proposalButton}>
                            <Text style={styles.proposalButtonText}>Enviar Proposta</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>{isLoading ? 'A procurar projetos...' : 'Nenhum projeto disponível no momento.'}</Text>}
            />
        </View>
    );
};


export default function ProjectsScreen({ route }) {
    const { userType } = route.params;
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            {userType === 'cliente' ? <ClientProjectsView /> : <ProfessionalProjectsView />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    actionButtonText: {
        color: '#3B82F6',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    },
    buttonIcon: {
        width: 18,
        height: 18,
        tintColor: '#3B82F6',
    },
    projectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectTitle: { fontSize: 18, fontWeight: 'bold' },
    projectInfo: { color: '#6B7280', marginVertical: 10 },
    statusBadge: {
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    statusEmAndamento: { backgroundColor: '#DBEAFE', color: '#3B82F6' },
    statusConcluído: { backgroundColor: '#DCFCE7', color: '#16A34A' },
    statusAguardando: { backgroundColor: '#FEF3C7', color: '#F59E0B' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6B7280' },
    reviewButton: {
        marginTop: 10,
        backgroundColor: '#FBBF24',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    reviewButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginTop: 5,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#3B82F6',
        borderRadius: 4,
    },
    progressText: {
        textAlign: 'right',
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    proposalButton: {
        marginTop: 15,
        backgroundColor: '#10B981',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    proposalButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

