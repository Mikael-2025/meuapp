import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, FlatList } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import Icon from '../components/Icon'; // Usaremos nosso componente de ícone

// Componente para um cartão de estatística
const StatCard = ({ title, value, icon }) => (
    <View style={styles.statCard}>
        <Icon name={icon} style={styles.statIcon} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
    </View>
);

// Componente para um cartão de projeto
const ProjectCard = ({ title, status, professional, progress }) => (
    <View style={styles.projectCard}>
        <View style={styles.projectHeader}>
            <Text style={styles.projectTitle}>{title}</Text>
            <Text style={[styles.statusBadge, styles[`status${status}`]]}>{status}</Text>
        </View>
        <Text style={styles.projectInfo}>com {professional}</Text>
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% Completo</Text>
    </View>
);

export default function DashboardCliente() {
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

  // Dados de exemplo para a lista de projetos
  const projects = [
      { id: '1', title: 'E-commerce App', status: 'Em Andamento', professional: 'Ricardo Silva', progress: 45 },
      { id: '2', title: 'Website Corporativo', status: 'Aguardando', professional: 'Juliana Costa', progress: 30 },
      { id: '3', title: 'App Mobile', status: 'Concluído', professional: 'Carlos Santos', progress: 100 },
  ];

  return (
    <SafeAreaView style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
            <View>
                {/* Saudação ao usuário */}
                <Text style={styles.headerGreeting}>Olá,</Text>
                <Text style={styles.headerUserName}>{userName.split(' ')[0]}!</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity>
                    <Icon name="notificacao" style={styles.headerIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={{ uri: 'https://placehold.co/100x100/ffffff/3B82F6?text=A' }} style={styles.avatar} />
                </TouchableOpacity>
            </View>
        </View>

        {/* Cartões de Estatísticas */}
        <View style={styles.statsContainer}>
            <StatCard title="Projetos Ativos" value="4" icon="projetos" />
            <StatCard title="Investimento" value="R$ 24.7k" icon="investimento" />
            <StatCard title="Profissionais" value="6" icon="profissionais" />
            <StatCard title="Avaliação" value="4.8 ★" icon="avaliacao" />
        </View>

        {/* Corpo Principal com a Lista de Projetos */}
        <View style={styles.mainContent}>
             <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Projetos em Andamento</Text>
                <TouchableOpacity><Text style={styles.seeAll}>Ver todos</Text></TouchableOpacity>
            </View>
            <FlatList
                data={projects}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ProjectCard {...item} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E40AF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    headerGreeting: { color: '#E0E1DD', fontSize: 18 },
    headerUserName: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    headerIcon: { width: 24, height: 24, tintColor: '#FFFFFF', marginHorizontal: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 10 },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    statCard: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 10,
        width: '23%',
    },
    statIcon: { width: 28, height: 28, tintColor: '#FFFFFF', marginBottom: 5 },
    statValue: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    statTitle: { color: '#E0E1DD', fontSize: 10, textAlign: 'center' },
    mainContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
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
    projectCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
    statusBadge: {
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    statusEmAndamento: { backgroundColor: '#DBEAFE', color: '#3B82F6' },
    statusAguardando: { backgroundColor: '#FEF3C7', color: '#F59E0B' },
    statusConcluído: { backgroundColor: '#DCFCE7', color: '#16A34A' },
    projectInfo: {
        fontSize: 14,
        color: '#6B7280',
        marginVertical: 10,
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
});

