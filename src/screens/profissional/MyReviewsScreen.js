import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import UserAvatar from '../../components/UserAvatar';

// Dados de exemplo para as avaliações recebidas
const MOCK_REVIEWS = [
    { id: '1', clientName: 'Mikael L.', projectName: 'App de E-commerce', rating: 5, comment: 'Excelente profissional! Entregou o projeto no prazo e com uma qualidade impecável. Recomendo fortemente.' },
    { id: '2', clientName: 'Carla Dias', projectName: 'Website Institucional', rating: 4, comment: 'Bom trabalho, a comunicação foi clara e o resultado final atendeu às expectativas.' },
    { id: '3', clientName: 'Pedro Martins', projectName: 'Consultoria de UI/UX', rating: 5, comment: 'Muito atencioso e com ótimas ideias. Ajudou muito o nosso projeto a evoluir.' },
];

const starIconImage = require('../../../assets/icons/avaliacao.png');

// Componente para um cartão de avaliação
const ReviewCard = ({ item }) => (
    <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
            <UserAvatar name={item.clientName} size={40} />
            <View style={styles.reviewHeaderText}>
                <Text style={styles.reviewClientName}>{item.clientName}</Text>
                <Text style={styles.reviewProjectName}>{item.projectName}</Text>
            </View>
        </View>
        <Text style={styles.reviewComment}>"{item.comment}"</Text>
        <View style={styles.reviewRating}>
            {[...Array(5)].map((_, i) => (
                <Image key={i} source={starIconImage} style={[styles.starIcon, { tintColor: i < item.rating ? '#FBBF24' : '#E5E7EB' }]} />
            ))}
        </View>
    </View>
);

export default function MyReviewsScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="voltar" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Minhas Avaliações</Text>
                <View style={{ width: 30 }} />
            </View>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>4.9</Text>
                <View style={styles.summaryStars}>
                    {[...Array(5)].map((_, i) => (
                        <Image key={i} source={starIconImage} style={[styles.summaryStarIcon, { tintColor: i < 5 ? '#FBBF24' : '#E5E7EB' }]} />
                    ))}
                </View>
                <Text style={styles.summaryText}>Baseado em 12 avaliações</Text>
            </View>

            <FlatList
                data={MOCK_REVIEWS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ReviewCard item={item} />}
                contentContainerStyle={{ padding: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backIcon: { width: 24, height: 24, tintColor: '#1F2937' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        margin: 20,
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 4,
    },
    summaryValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    summaryStars: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    summaryStarIcon: {
        width: 24,
        height: 24,
        marginHorizontal: 2,
    },
    summaryText: {
        fontSize: 14,
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
    starIcon: {
        width: 16,
        height: 16,
        marginRight: 2,
    },
});

