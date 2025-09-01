import React, { useState, useEffect } from 'react';
// A importação do ActivityIndicator está aqui
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import Icon from '../../components/Icon';
import UserAvatar from '../../components/UserAvatar';

const MOCK_PROFESSIONALS = [
    { id: '1', name: 'Ricardo Silva', specialty: 'Desenvolvedor React Native', location: 'São Paulo, SP', rating: 4.8, reviews: 15 },
    { id: '2', name: 'Juliana Costa', specialty: 'Designer UI/UX', location: 'Rio de Janeiro, RJ', rating: 4.9, reviews: 22 },
];

const CATEGORIES = ['Todos', 'Web', 'Mobile', 'Design', 'Backend'];

const ProfessionalCard = ({ item }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProfessionalProfile', { professionalId: item.id })}>
            <UserAvatar name={item.name} size={80} />
            <Text style={styles.professionalName}>{item.name}</Text>
            <Text style={styles.professionalSpecialty}>{item.specialty}</Text>
            <Text style={styles.professionalLocation}>{item.location}</Text>
            <View style={styles.cardRating}>
                <Icon name="avaliacao" style={styles.starIcon} />
                <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
            </View>
        </TouchableOpacity>
    );
};

export default function FindProfessionalsScreen({ navigation: nav }) {
    const [professionals, setProfessionals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Todos');

    useEffect(() => {
        const fetchProfessionals = async () => {
            const q = query(collection(db, "users"), where("userType", "==", "profissional"));
            const querySnapshot = await getDocs(q);
            const professionalUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProfessionals(MOCK_PROFESSIONALS);
            setIsLoading(false);
        };
        fetchProfessionals();
    }, []);

    // O ecrã de carregamento que usa o ActivityIndicator
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()}>
                    <Icon name="voltar" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Encontrar Profissionais</Text>
                <View style={{ width: 30 }} />
            </View>

            <View style={styles.searchAndFilterContainer}>
                <View style={styles.searchBar}>
                    <Icon name="buscar" style={styles.searchIcon} />
                    <TextInput placeholder="Pesquisar por nome ou especialidade..." style={styles.searchInput} />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                    {CATEGORIES.map(category => (
                        <TouchableOpacity 
                            key={category} 
                            style={[styles.filterButton, activeCategory === category && styles.filterButtonActive]}
                            onPress={() => setActiveCategory(category)}
                        >
                            <Text style={[styles.filterText, activeCategory === category && styles.filterTextActive]}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={professionals}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ProfessionalCard item={item} />}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum profissional encontrado.</Text>}
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
    searchAndFilterContainer: {
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginHorizontal: 20,
    },
    searchIcon: { width: 20, height: 20, tintColor: '#9CA3AF', marginRight: 10 },
    searchInput: { flex: 1, height: 50, fontSize: 16 },
    filterContainer: {
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        marginRight: 10,
    },
    filterButtonActive: {
        backgroundColor: '#3B82F6',
    },
    filterText: {
        color: '#4B5563',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    card: {
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    professionalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 15,
    },
    professionalSpecialty: {
        fontSize: 14,
        color: '#6B7280',
        marginVertical: 4,
    },
    professionalLocation: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 10,
    },
    cardRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    starIcon: {
        width: 16,
        height: 16,
        tintColor: '#FBBF24',
        marginRight: 5,
    },
    ratingText: {
        fontWeight: 'bold',
        color: '#D97706',
        fontSize: 14,
    },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6B7280' },
});
