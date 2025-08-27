import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

// --- Ícones com Imagens PNG ---
const Icon = ({ name, style }) => {
    // O 'require' carrega as suas imagens locais.
    // Certifique-se de que os nomes dos ficheiros correspondem.
    const icons = {
        'projetos': require('../../assets/icons/projetos.png'),
        'investimento': require('../../assets/icons/investimento.png'),
        'profissionais': require('../../assets/icons/profissionais.png'),
        'avaliacao': require('../../assets/icons/avaliacao.png')
    };
    
    if (!icons[name]) return null; // Se o ícone não for encontrado, não mostra nada.

    // Usamos <Image> para mostrar o seu ficheiro PNG
    return <Image source={icons[name]} style={[styles.icon, style]} />;
};

// --- Componentes Reutilizáveis ---
const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.statCard}>
        <View style={[styles.statIconContainer, { backgroundColor: color }]}>
            <Icon name={icon} style={styles.statCardIcon} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
    </View>
);

const ProjectCard = ({ title, status, professional, price, progress }) => (
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

  return (
    <SafeAreaView style={styles.container}>
        {/* A barra de navegação foi removida daqui e será gerida pelo App.js */}
        <ScrollView>
            <LinearGradient
                colors={['#4F46E5', '#818CF8']}
                style={styles.header}
            >
                <View style={styles.headerTopRow}>
                    <Text style={styles.headerTitle}>Olá, {userName.split(' ')[0]}!</Text>
                    <Image source={{ uri: 'https://placehold.co/100x100/ffffff/4F46E5?text=A' }} style={styles.avatar} />
                </View>
            </LinearGradient>

            <View style={styles.statsContainer}>
                <StatCard title="Projetos Ativos" value="4" icon="projetos" color="#EDE9FE" />
                <StatCard title="Investimento" value="R$ 24.7k" icon="investimento" color="#DCFCE7" />
                <StatCard title="Profissionais" value="6" icon="profissionais" color="#DBEAFE" />
                <StatCard title="Avaliação" value="4.8 ★" icon="avaliacao" color="#FEF9C3" />
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Projetos Recentes</Text>
                    <TouchableOpacity><Text style={styles.viewAll}>Ver todos</Text></TouchableOpacity>
                </View>
                <ProjectCard title="E-commerce App" status="Em Andamento" professional="Ricardo Silva" price="9.200" progress={45} />
                <ProjectCard title="Website Corporativo" status="Aguardando" professional="Juliana Costa" price="4.500" progress={30} />
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 60,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#C7D2FE',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        marginTop: -40,
        marginBottom: 20,
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
        width: '46%',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: { // Estilo base para os ícones de imagem
        width: 22,
        height: 22,
    },
    statCardIcon: { // Estilo específico para os ícones nos cartões de estatística
        tintColor: '#4F46E5' // Exemplo de como pode colorir ícones PNG brancos
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    statTitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    viewAll: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '600',
    },
    projectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
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
        backgroundColor: '#4F46E5',
        borderRadius: 4,
    },
    progressText: {
        textAlign: 'right',
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
});
