import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import Icon from '../../components/Icon';
import UserAvatar from '../../components/UserAvatar';

const StatCard = ({ title, value, icon, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
        <Icon name={icon} style={styles.statIcon} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
);

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

  const projects = [
      { id: '1', title: 'E-commerce App', status: 'Em Andamento', professional: 'Ricardo Silva', progress: 45 },
      { id: '2', title: 'Website Corporativo', status: 'Aguardando', professional: 'Juliana Costa', progress: 30 },
      { id: '3', title: 'App Mobile', status: 'Concluído', professional: 'Carlos Santos', progress: 100 },
  ];

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
             <View>
                <Text style={styles.headerGreeting}>Olá,</Text>
                <Text style={styles.headerUserName}>{userData?.name?.split(' ')[0]}!</Text>
            </View>
            {/* O TouchableOpacity agora tem um estilo para a borda */}
            <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('Perfil')}>
                <UserAvatar name={userData?.name} imageUrl={userData?.profilePictureUrl} size={40} />
            </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
            <StatCard title="Projetos" value="4" icon="projetos" onPress={() => navigation.navigate('Projetos')} />
            <StatCard title="Pagamentos" value="R$ 100" icon="pagamentos" onPress={() => navigation.navigate('Pagamentos')} />
            <StatCard title="Buscar" value="6" icon="profissionais" onPress={() => navigation.navigate('FindProfessionals')} />
            {/* O cartão de Avaliação agora navega para a nova tela "PendingReviews" */}
            <StatCard title="Avaliar" value="0" icon="avaliacao" onPress={() => navigation.navigate('PendingReviews')} />
        </View>

        <View style={styles.mainContent}>
             <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Projetos em Andamento</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Projetos')}><Text style={styles.seeAll}>Ver todos</Text></TouchableOpacity>
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
    container: { 
        flex: 1, 
        backgroundColor: '#4F46E5',
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
    headerGreeting: { 
        color: '#ffffff', 
        fontSize: 18, 
    },
    headerUserName: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
    },
    // Estilo para adicionar a borda ao avatar
    avatarContainer: {
        borderWidth: 2,
        borderColor: '#ffe713ff', // Cor da borda
        borderRadius: 22, // Metade do tamanho do avatar + a largura da borda
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

