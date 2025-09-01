import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
// O caminho para a firebaseConfig está correto
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
// 1. Os caminhos para os componentes foram corrigidos de ../../../ para ../../
import Icon from '../../components/Icon';
import UserAvatar from '../../components/UserAvatar';

// O caminho para a imagem está correto
const starIconImage = require('../../../assets/icons/avaliacao.png');

const MOCK_PROFESSIONALS = [
    { id: '1', name: 'Ricardo Silva', specialty: 'Desenvolvedor React Native', location: 'São Paulo, SP', rating: 4.8, reviews: 15, bio: 'Mais de 5 anos de experiência criando aplicativos móveis incríveis. Especialista em performance e interfaces fluidas.' },
    { id: '2', name: 'Juliana Costa', specialty: 'Designer UI/UX', location: 'Rio de Janeiro, RJ', rating: 4.9, reviews: 22, bio: 'Apaixonada por criar experiências de utilizador que são não apenas bonitas, mas também intuitivas e fáceis de usar.' },
];

const ReviewCard = ({ review }) => (
    <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
            <UserAvatar name={review.clientName} size={40} />
            <View style={styles.reviewHeaderText}>
                <Text style={styles.reviewClientName}>{review.clientName}</Text>
                <Text style={styles.reviewProjectName}>{review.projectName}</Text>
            </View>
        </View>
        <Text style={styles.reviewComment}>"{review.comment}"</Text>
        <View style={styles.reviewRating}>
            {[...Array(5)].map((_, i) => (
                <Image key={i} source={starIconImage} style={[styles.starIcon, { tintColor: i < review.rating ? '#FBBF24' : '#E5E7EB' }]} />
            ))}
        </View>
    </View>
);

const InfoRow = ({ iconName, label, value }) => (
    <View style={styles.infoRow}>
        <Icon name={iconName} style={styles.infoIcon} />
        <View>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

const PortfolioCard = ({ item }) => (
    <View style={styles.portfolioCard}>
        <Image source={{ uri: item.url }} style={styles.portfolioImage} />
        <View style={styles.portfolioInfo}>
            <Icon name={item.categoryIcon} style={styles.portfolioIcon} />
            <View>
                <Text style={styles.portfolioTitle}>{item.title}</Text>
                <Text style={styles.portfolioCategory}>{item.category}</Text>
            </View>
        </View>
    </View>
);

export default function ProfessionalProfileScreen({ navigation }) {
    const route = useRoute();
    const { professionalId } = route.params; 
    const [professional, setProfessional] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

    useEffect(() => {
        const fetchProfessionalData = async () => {
            const mockData = MOCK_PROFESSIONALS.find(p => p.id === professionalId);
            setProfessional(mockData);
            setIsLoading(false);
        };

        if (professionalId) {
            fetchProfessionalData();
        }
    }, [professionalId]);
    
    const portfolioItems = [
        { id: '1', title: 'App de E-commerce', category: 'Desenvolvimento Mobile', categoryIcon: 'mobile', url: 'https://placehold.co/400x300/A5B4FC/FFFFFF?text=Projeto+1' },
        { id: '2', title: 'Sistema de Gestão', category: 'Desenvolvimento Web', categoryIcon: 'web', url: 'https://placehold.co/400x300/A5B4FC/FFFFFF?text=Projeto+2' },
        { id: '3', title: 'Identidade Visual', category: 'Design', categoryIcon: 'design', url: 'https://placehold.co/400x300/A5B4FC/FFFFFF?text=Projeto+3' },
    ];
    
    const reviews = [
        { id: '1', clientName: 'Mikael', projectName: 'App de E-commerce', rating: 5, comment: 'Excelente profissional! Entregou o projeto no prazo e com uma qualidade impecável. Recomendo fortemente.'},
        { id: '2', clientName: 'Carla Dias', projectName: 'Website Institucional', rating: 4, comment: 'Bom trabalho, a comunicação foi clara e o resultado final atendeu às expectativas.'},
    ];

    if (isLoading || !professional) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#3B82F6"/>
            </SafeAreaView>
        );
    }

    const handleGoToChat = () => {
        setSuccessModalVisible(false);
        navigation.navigate('Chat', { userName: professional.name, userId: professional.id });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <LinearGradient
                    colors={['#3B82F6', '#60A5FA']}
                    style={styles.header}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="voltar" style={[styles.backIcon, { tintColor: '#FFFFFF' }]} />
                    </TouchableOpacity>
                    <UserAvatar name={professional.name} size={100} imageUrl={professional.profilePictureUrl} />
                    <Text style={[styles.name, { color: '#FFFFFF' }]}>{professional.name}</Text>
                    <Text style={[styles.specialty, { color: '#E0E7FF' }]}>{professional.specialty}</Text>
                    <View style={styles.ratingContainer}>
                        <Image source={starIconImage} style={styles.starIcon} />
                        <Text style={[styles.ratingText, { color: '#FFFFFF' }]}>{professional.rating} ({professional.reviews} avaliações)</Text>
                    </View>
                </LinearGradient>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalhes</Text>
                    <InfoRow iconName="especialidade" label="Especialidade Principal" value={professional.specialty} />
                    <InfoRow iconName="localizacao" label="Localização" value={professional.location} />
                    <InfoRow iconName="projetos" label="Projetos Concluídos" value={professional.reviews} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Portfólio</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {portfolioItems.map(item => (
                             <PortfolioCard key={item.id} item={item} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Avaliações de Clientes</Text>
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.contactButton} onPress={() => setSuccessModalVisible(true)}>
                    <Text style={styles.contactButtonText}>Contratar Agora</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isSuccessModalVisible}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.successModalContainer}>
                        <View style={styles.successIconContainer}>
                            <Icon name="check" style={styles.successIcon} />
                        </View>
                        <Text style={styles.successModalTitle}>Proposta Enviada!</Text>
                        <Text style={styles.successModalText}>
                            A sua proposta foi enviada para {professional.name}. Por favor, aguarde o contacto do profissional no seu chat.
                        </Text>
                        <TouchableOpacity style={styles.successModalButton} onPress={handleGoToChat}>
                            <Text style={styles.successModalButtonText}>Ir para o Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center' },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
    },
    backButton: { position: 'absolute', top: 60, left: 15, zIndex: 1, padding: 10 },
    backIcon: { width: 24, height: 24, tintColor: '#1F2937' },
    name: { fontSize: 22, fontWeight: 'bold', marginTop: 15, color: '#1F2937' },
    specialty: { fontSize: 16, color: '#3B82F6', marginVertical: 4 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    starIcon: { width: 16, height: 16, marginRight: 5, tintColor: '#FBBF24' },
    ratingText: { fontSize: 14, color: '#6B7280' },
    section: { paddingHorizontal: 20, paddingVertical: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, paddingLeft: 0 },
    
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    infoIcon: {
        width: 24,
        height: 24,
        tintColor: '#3B82F6',
        marginRight: 15,
    },
    infoLabel: {
        color: '#6B7280',
        fontSize: 14,
    },
    infoValue: {
        color: '#1F2937',
        fontSize: 16,
        fontWeight: '600',
    },

    portfolioCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginRight: 15,
        width: 250, 
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    portfolioImage: { 
        width: '100%', 
        height: 150, 
    },
    portfolioInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    portfolioIcon: {
        width: 20,
        height: 20,
        tintColor: '#3B82F6',
        marginRight: 10,
    },
    portfolioTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    portfolioCategory: {
        fontSize: 12,
        color: '#6B7280',
    },

    reviewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    reviewHeaderText: {
        marginLeft: 10,
    },
    reviewClientName: {
        fontWeight: 'bold',
    },
    reviewProjectName: {
        fontSize: 12,
        color: '#6B7280',
    },
    reviewComment: {
        fontStyle: 'italic',
        color: '#4B5563',
        marginBottom: 10,
    },
    reviewRating: {
        flexDirection: 'row',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    contactButton: {
        backgroundColor: '#3B82F6',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successModalContainer: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successIcon: {
        width: 40,
        height: 40,
        tintColor: '#FFFFFF',
    },
    successModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    successModalText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 25,
    },
    successModalButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
    },
    successModalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

