import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
// 1. Importe as novas bibliotecas
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, onSnapshot } from "firebase/firestore";
import Icon from '../../components/Icon';

export default function SelectPaymentMethodScreen({ route }) {
    const navigation = useNavigation();
    const { projectId, amount } = route.params;
    const isFocused = useIsFocused();
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMethod, setSelectedMethod] = useState('card');
    // 2. Criei um estado para guardar a nossa chave Pix de exemplo
    const [pixKey, setPixKey] = useState('00020126330014br.gov.bcb.pix0111123456789010215valor_do_projeto5204000053039865802BR5913NOME_RECEBEDOR6009SAO PAULO62070503***6304E7DF');

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

    const handleCardPayment = (card) => {
        Alert.alert(
            "Confirmar Pagamento",
            `Você está prestes a pagar R$ ${amount} com o cartão final ${card.cardNumber}.`,
            [
                { text: "Cancelar" },
                { text: "Confirmar", onPress: () => {
                    Alert.alert("Sucesso!", "O pagamento foi realizado.");
                    navigation.navigate('Pagamentos');
                }}
            ]
        );
    };

    // 3. Criei uma função para copiar a chave Pix
    const handleCopyKey = async () => {
        await Clipboard.setStringAsync(pixKey);
        Alert.alert("Chave Pix Copiada!", "Use a chave no seu aplicativo de banco para pagar.");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="voltar" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Escolher Forma de Pagamento</Text>
                <View style={{ width: 30 }} />
            </View>

            <View style={styles.summary}>
                <Text style={styles.summaryText}>Total a pagar:</Text>
                <Text style={styles.summaryAmount}>R$ {amount}</Text>
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity 
                    style={[styles.tab, selectedMethod === 'card' && styles.tabActive]} 
                    onPress={() => setSelectedMethod('card')}
                >
                    <Text style={[styles.tabText, selectedMethod === 'card' && styles.tabTextActive]}>Cartão de Crédito</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, selectedMethod === 'pix' && styles.tabActive]} 
                    onPress={() => setSelectedMethod('pix')}
                >
                    <Text style={[styles.tabText, selectedMethod === 'pix' && styles.tabTextActive]}>Pix</Text>
                </TouchableOpacity>
            </View>

            {selectedMethod === 'card' ? (
                <FlatList
                    data={cards}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.cardContainer}>
                            <View style={styles.cardInfo}>
                                <Icon name="pagamentos" style={styles.cardIcon} />
                                <View>
                                    <Text style={styles.cardText}>**** **** **** {item.cardNumber}</Text>
                                    <Text style={styles.cardHolder}>{item.holderName}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.selectButton} onPress={() => handleCardPayment(item)}>
                                <Text style={styles.selectButtonText}>Usar este</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>{isLoading ? 'A carregar...' : 'Nenhum cartão adicionado.'}</Text>
                        </View>
                    }
                />
            ) : (
                // 4. A secção do Pix foi redesenhada
                <View style={styles.pixContainer}>
                    <Text style={styles.pixTitle}>Pague com o QR Code</Text>
                    <View style={styles.qrCodeContainer}>
                         <QRCode
                            value={pixKey}
                            size={200}
                        />
                    </View>
                   
                    <Text style={styles.pixDescription}>
                        Abra o app do seu banco e escaneie o código, ou copie a chave abaixo.
                    </Text>

                    <View style={styles.copyKeyContainer}>
                        <Text style={styles.pixKeyText} numberOfLines={1}>{pixKey}</Text>
                        <TouchableOpacity style={styles.copyButton} onPress={handleCopyKey}>
                            <Text style={styles.copyButtonText}>Copiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
    summary: {
        padding: 20,
        backgroundColor: '#E0E7FF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryText: { fontSize: 16, color: '#4338CA' },
    summaryAmount: { fontSize: 22, fontWeight: 'bold', color: '#4338CA' },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    tab: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#3B82F6',
    },
    tabText: {
        fontSize: 16,
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIcon: {
        width: 24,
        height: 24,
        tintColor: '#3B82F6',
        marginRight: 15,
    },
    cardText: { fontSize: 16, color: '#1F2937' },
    cardHolder: { fontSize: 12, color: '#6B7280' },
    selectButton: {
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    selectButtonText: { color: '#4338CA', fontWeight: 'bold' },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: { textAlign: 'center', fontSize: 16, color: '#6B7280' },
    pixContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    qrCodeContainer: {
        borderWidth: 5,
        borderColor: '#10B981',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    pixTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    pixDescription: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    copyKeyContainer: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        padding: 5,
        alignItems: 'center',
        width: '100%',
    },
    pixKeyText: {
        flex: 1,
        paddingHorizontal: 10,
        color: '#4B5563',
    },
    copyButton: {
        backgroundColor: '#10B981',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 6,
    },
    copyButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

