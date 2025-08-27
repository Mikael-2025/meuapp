import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebaseConfig';
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// --- Componente de Ícone Modificado (usando as suas imagens PNG) ---
const Icon = ({ name, style }) => {
   
    const icons = {
        'home': require('../../assets/icons/casa.png'),
        'propostas': require('../../assets/icons/proposta.png'), 
        'mensagens': require('../../assets/icons/mensagem.png'),
        'perfil': require('../../assets/icons/perfil.png'),
        'ganhos': require('../../assets/icons/ganhos.png'), 
        'concluidos': require('../../assets/icons/concluido.png'),
        'avaliacao': require('../../assets/icons/avaliacao.png'),
        'plus': require('../../assets/icons/plus.png'), 
    };

    if (!icons[name]) return null;

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

const ProposalCard = ({ title, clientName, price, status }) => (
    <View style={styles.proposalCard}>
        <View>
            <Text style={styles.proposalTitle}>{title}</Text>
            <Text style={styles.proposalInfo}>de {clientName}</Text>
        </View>
        <View style={styles.proposalRight}>
            <Text style={styles.proposalPrice}>R$ {price}</Text>
            <Text style={[styles.statusBadge, styles[`status${status}`]]}>{status}</Text>
        </View>
    </View>
);


export default function DashboardProfissional() {
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

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Erro no logout: ", error));
  };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            {/* Cabeçalho com Gradiente */}
            <LinearGradient
                colors={['#4F46E5', '#818CF8']} // Tons de verde para diferenciar
                style={styles.header}
            >
                <View style={styles.headerTopRow}>
                    <Text style={styles.headerTitle}>Seu Painel, {userName.split(' ')[0]}!</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <Image source={{ uri: 'https://placehold.co/100x100/ffffff/0F766E?text=P' }} style={styles.avatar} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Cartões de Estatísticas */}
            <View style={styles.statsContainer}>
                <StatCard title="Ganhos no Mês" value="R$ 7.8k" icon="ganhos" color="#DCFCE7" />
                <StatCard title="Projetos Concluídos" value="12" icon="concluidos" color="#DBEAFE" />
                <StatCard title="Novas Propostas" value="3" icon="propostas" color="#EDE9FE" />
                <StatCard title="Sua Avaliação" value="4.9 ★" icon="avaliacao" color="#FEF9C3" />
            </View>

            {/* Propostas Recentes */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Propostas Recentes</Text>
                    <TouchableOpacity><Text style={styles.viewAll}>Ver todas</Text></TouchableOpacity>
                </View>
                <ProposalCard title="Desenvolvimento de App Mobile" clientName="Ana Ferreira" price="12.000" status="Nova" />
                <ProposalCard title="Criação de Website" clientName="Carlos Souza" price="4.500" status="Enviada" />
                 <ProposalCard title="Manutenção de E-commerce" clientName="Juliana Costa" price="1.500" status="Aceita" />
            </View>
        </ScrollView>

        {/* --- Barra de Navegação Inferior com Botão Central --- */}
        <View style={styles.navBarContainer}>
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navButton}>
                    <Icon name="home" style={[styles.navIcon, styles.navIconActive]} />
                    <Text style={[styles.navText, styles.navTextActive]}>Início</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Icon name="propostas" style={styles.navIcon} />
                    <Text style={styles.navText}>Propostas</Text>
                </TouchableOpacity>
                
                <View style={{ width: 50 }} />

                <TouchableOpacity style={styles.navButton}>
                    <Icon name="mensagens" style={styles.navIcon} />
                    <Text style={styles.navText}>Mensagens</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Icon name="perfil" style={styles.navIcon} />
                    <Text style={styles.navText}>Perfil</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.fab}>
                <Icon name="plus" style={styles.fabIcon} />
            </TouchableOpacity>
        </View>
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
        borderColor: '',
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
    icon: {
        width: 24,
        height: 24,
    },
    statCardIcon: {
        width: 20,
        height: 20,
        tintColor: '#0F766E'
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
    proposalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    proposalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: '90%',
    },
    proposalInfo: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    proposalRight: {
        alignItems: 'flex-end',
    },
    proposalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
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
    statusNova: { backgroundColor: '#FEF3C7', color: '#F59E0B' },
    statusEnviada: { backgroundColor: '#DBEAFE', color: '#3B82F6' },
    statusAceita: { backgroundColor: '#D1FAE5', color: '#10B981' },
    navBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    navBar: {
        flexDirection: 'row',
        height: 70,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 5,
    },
    navButton: {
        alignItems: 'center',
        flex: 1,
    },
    navIcon: {
        width: 24,
        height: 24,
        tintColor: '#9CA3AF',
    },
    navIconActive: {
        tintColor: '#4F46E5',
    },
    navText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    navTextActive: {
        color: '#4F46E5',
    },
    fab: {
        position: 'absolute',
        bottom: 35,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    fabIcon: {
        width: 30,
        height: 30,
        tintColor: '#FFFFFF',
    },
});
