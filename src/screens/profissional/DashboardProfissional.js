import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import Icon from '../../components/Icon';
import UserAvatar from '../../components/UserAvatar';

// Componente para um cartão de estatística
const StatCard = ({ title, value, icon, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
        <Icon name={icon} style={styles.statIcon} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
);

// Componente para um cartão de proposta de projeto
const ProposalCard = ({ item }) => (
    <View style={styles.proposalCard}>
        <View style={styles.proposalInfo}>
            <Text style={styles.proposalTitle}>{item.title}</Text>
            <Text style={styles.proposalClient}>de {item.clientName}</Text>
        </View>
        <View style={styles.proposalRight}>
            <Text style={styles.proposalBudget}>R$ {item.budget}</Text>
            <Text style={[styles.statusBadge, styles[`status${item.status}`]]}>{item.status}</Text>
        </View>
    </View>
);

export default function DashboardProfissional() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, []);

  // Dados de exemplo para novas propostas
  const newProposals = [
      { id: '1', title: 'Desenvolvimento de App Mobile', clientName: 'Ana Ferreira', budget: '12.000', status: 'Nova' },
      { id: '2', title: 'Criação de Website', clientName: 'Carlos Souza', budget: '4.500', status: 'Enviada' },
      { id: '3', title: 'Manutenção de E-commerce', clientName: 'Juliana Costa', budget: '1.500', status: 'Aceita' },
  ];

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Seu Painel, {userData?.name?.split(' ')[0]}!</Text>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('Perfil')}>
                <UserAvatar name={userData?.name} imageUrl={userData?.profilePictureUrl} size={40} />
            </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
            <StatCard title="Ganhos no Mês" value="R$ 7.8k" icon="investimento" onPress={() => navigation.navigate('Earnings')} />
            {/* O onPress foi corrigido para navegar para a tela de Projetos Concluídos */}
            <StatCard title="Projetos Concluídos" value="12" icon="concluido" onPress={() => navigation.navigate('CompletedProjects')} />
            <StatCard title="Novas Propostas" value="3" icon="propostas" onPress={() => navigation.navigate('Propostas')} />
            <StatCard title="Sua Avaliação" value="4.9 ★" icon="avaliacao" onPress={() => {}} />
        </View>

        <View style={styles.mainContent}>
             <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Propostas Recentes</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Propostas')}><Text style={styles.seeAll}>Ver todas</Text></TouchableOpacity>
            </View>
            <FlatList
                data={newProposals}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ProposalCard item={item} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    </SafeAreaView>
  );
}

// Estilos mantidos com as suas modificações de cor
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#4F46E5',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    avatarContainer: {
        borderWidth: 2,
        borderColor: '#FBBF24', // Borda amarela
        borderRadius: 22,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: '#4F46E5'
    },
    statCard: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 15,
        paddingVertical: 15,
        width: '23%',
    },
    statIcon: { width: 28, height: 28, tintColor: '#FFFFFF', marginBottom: 8 },
    statValue: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    statTitle: { color: '#E0E7FF', fontSize: 10, textAlign: 'center', marginTop: 4 },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    seeAll: { fontSize: 14, color: '#3B82F6', fontWeight: '600' },
    proposalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    proposalInfo: {
        flex: 1,
    },
    proposalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    proposalClient: {
        fontSize: 14,
        color: '#6B7280',
    },
    proposalRight: {
        alignItems: 'flex-end',
    },
    proposalBudget: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statusBadge: {
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: 'bold',
        overflow: 'hidden',
        marginTop: 4,
    },
    statusNova: { backgroundColor: '#DBEAFE', color: '#3B82F6' },
    statusEnviada: { backgroundColor: '#FEF3C7', color: '#F59E0B' },
    statusAceita: { backgroundColor: '#DCFCE7', color: '#16A34A' },
});

