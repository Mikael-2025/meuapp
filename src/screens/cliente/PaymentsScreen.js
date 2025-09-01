import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, onSnapshot } from "firebase/firestore";
import Icon from '../../components/Icon';

const CreditCard = ({ item, index }) => {
    const cardColors = [['#d400ffff', '#c300ffff'], ['#10B981', '#6EE7B7'], ['#F59E0B', '#FCD34D']];
    const gradientColors = cardColors[index % cardColors.length];

    return (
        <LinearGradient colors={gradientColors} style={styles.card}>
            <Text style={styles.cardHolder}>{item.holderName}</Text>
            <Text style={styles.cardNumber}>**** **** **** {item.cardNumber}</Text>
            <Text style={styles.cardExpiry}>Validade {item.expiryDate}</Text>
        </LinearGradient>
    );
};

export default function PaymentsScreen() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isFocused) return;
        const user = auth.currentUser;
        if (user) {
            const q = query(collection(db, "users", user.uid, "cards"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const userCards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCards(userCards);
                setIsLoading(false);
            });
            return () => unsubscribe();
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pagamentos</Text>
            </View>

            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.cardSectionHeader}>
                        <Text style={styles.sectionTitle}>Meus Cartões</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AddCard')}>
                             <Icon name="plus" style={styles.addIcon} />
                        </TouchableOpacity>
                    </View>
                    {cards.length > 0 ? (
                        <FlatList
                            data={cards}
                            renderItem={({ item, index }) => <CreditCard item={item} index={index} />}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingVertical: 10, paddingLeft: 20 }}
                        />
                    ) : (
                        <View style={styles.emptyCardContainer}>
                            <Text style={styles.emptyText}>{isLoading ? 'A carregar...' : 'Nenhum cartão adicionado.'}</Text>
                             <TouchableOpacity 
                                style={styles.addCardButton}
                                onPress={() => navigation.navigate('AddCard')}
                            >
                                <Text style={styles.addCardButtonText}>+ Adicionar Novo Cartão</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <Text style={[styles.sectionTitle, { marginTop: 30, marginBottom: 20, paddingHorizontal: 20 }]}>Ações Rápidas</Text>
                    <View style={styles.quickActions}>
                        {/* Botão de Pagar Projeto agora navega para a nova tela */}
                        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('PayProject')}>
                            <Icon name="pagamentos" style={styles.actionIcon} />
                            <Text>Pagar Projeto</Text>
                        </TouchableOpacity>
                        {/* Botão de Ver Faturas agora navega para a nova tela */}
                        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Invoices')}>
                            <Icon name="fatura" style={styles.actionIcon} />
                            <Text>Ver Faturas</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 10, marginBottom: 20, paddingHorizontal: 20 }]}>Últimas transações</Text>
                    <View style={styles.transaction}>
                        
                        <View style={styles.transactionDetails}>
                            <Text>Pagamento: Website</Text>
                            <Text style={styles.transactionSubText}>Cartão final 1234</Text>
                        </View>
                        <Text style={styles.negativeAmount}>- R$ 4.500</Text>
                    </View>
                    <View style={styles.transaction}>
                         <Icon name="receber" style={[styles.transactionIcon, { backgroundColor: '#D1FAE5', tintColor: '#10B981' }]} />
                         <View style={styles.transactionDetails}>
                            <Text>Recebimento: App Mobile</Text>
                            <Text style={styles.transactionSubText}>Transferência</Text>
                        </View>
                        <Text style={styles.positiveAmount}>+ R$ 12.000</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#FFFFFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    content: { paddingVertical: 20 },
    cardSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    addIcon: { width: 24, height: 24, tintColor: '#3B82F6' },
    card: {
        borderRadius: 15,
        padding: 20,
        width: 300,
        marginRight: 15,
        height: 180,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    cardHolder: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    cardNumber: { color: '#FFFFFF', fontSize: 18, letterSpacing: 2 },
    cardExpiry: { color: '#FFFFFF', fontSize: 14 },
    emptyCardContainer: {
        marginHorizontal: 20,
        alignItems: 'center',
    },
    emptyText: { color: '#6B7280', fontStyle: 'italic', paddingVertical: 20 },
    addCardButton: {
        backgroundColor: '#E0E7FF',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C7D2FE',
        width: '100%',
    },
    addCardButtonText: { color: '#4338CA', fontWeight: 'bold' },
    quickActions: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginBottom: 30 },
    actionButton: { 
        backgroundColor: '#FFFFFF', 
        padding: 20, 
        borderRadius: 15, 
        alignItems: 'center', 
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    actionIcon: {
        width: 30,
        height: 30,
        tintColor: '#3B82F6',
        marginBottom: 10,
    },
    transaction: { 
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: '#FFFFFF', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        marginHorizontal: 20,
    },
    transactionIcon: {
        width: 20,
        height: 20,
        padding: 20,
        borderRadius: 20,
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionSubText: {
        fontSize: 12,
        color: '#6B7280'
    },
    positiveAmount: { color: '#16A34A', fontWeight: 'bold' },
    negativeAmount: { color: '#DC2626', fontWeight: 'bold' },
});

