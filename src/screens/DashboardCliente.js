import React, { useState, useEffect } from 'react';
// 1. O componente Image já estava importado, vamos usá-lo para os ícones
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebaseConfig';
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// --- Componente de Ícone Modificado ---
// 2. Agora, este componente vai carregar e mostrar as suas imagens PNG
const Icon = ({ name, style }) => {
    // O 'require' é a forma como o React Native carrega imagens locais.
    // Certifique-se de que os nomes dos ficheiros correspondem aos que estão na sua pasta assets/icons
    const icons = {
        'home': require('../../assets/icons/casa.png'), 
        'projetos': require('../../assets/icons/projetos.png'), 
        'mensagens': require('../../assets/icons/mensagem.png'), 
        'perfil': require('../../assets/icons/perfil.png'), 
        'investimento': require('../../assets/icons/investimento.png'),
        'profissionais': require('../../assets/icons/profissionais.png'),
        'avaliacao': require('../../assets/icons/avaliacao.png'),
    };

    // Se um ícone não for encontrado, não mostra nada.
    if (!icons[name]) return null;

    // 3. Em vez de <Text>, usamos <Image> para mostrar o seu PNG
    return <Image source={icons[name]} style={[styles.icon, style]} />;
};

// --- Componentes Reutilizáveis (não precisam de ser alterados) ---
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

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Erro no logout: ", error));
  };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <LinearGradient
                colors={['#4F46E5', '#818CF8']}
                style={styles.header}
            >
                <View style={styles.headerTopRow}>
                    <Text style={styles.headerTitle}>Olá, {userName.split(' ')[0]}!</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <Image source={{ uri: 'https://placehold.co/100x100/ffffff/4F46E5?text=A' }} style={styles.avatar} />
                    </TouchableOpacity>
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

        <View style={styles.navBar}>
            <TouchableOpacity style={styles.navButton}>
                <Icon name="home" style={[styles.navIcon, styles.navIconActive]} />
                <Text style={[styles.navText, styles.navTextActive]}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
                <Icon name="projetos" style={styles.navIcon} />
                <Text style={styles.navText}>Projetos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
                <Icon name="mensagens" style={styles.navIcon} />
                <Text style={styles.navText}>Mensagens</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
                <Icon name="perfil" style={styles.navIcon} />
                <Text style={styles.navText}>Perfil</Text>
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
        borderColor: '#A7F3D0',
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
    // 4. Estilo para os ícones de imagem
    icon: {
        width: 24,
        height: 24,
    },
    statCardIcon: { // Estilo específico para os ícones nos cartões de estatística
        width: 20,
        height: 20,
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
    navBar: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 5,
    },
    navButton: {
        alignItems: 'center',
    },
    navIcon: {
        width: 24, // Tamanho para os ícones da barra de navegação
        height: 24,
        tintColor: '#9CA3AF', // Cor para o ícone inativo
    },
    navIconActive: {
        tintColor: '#4F46E5', // Cor para o ícone ativo
    },
    navText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    navTextActive: {
        color: '#4F46E5',
    },
});
