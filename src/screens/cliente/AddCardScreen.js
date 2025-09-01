import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../../../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

// Componente para o Cartão de Crédito Interativo
const InteractiveCreditCard = ({ cardNumber, holderName, expiryDate }) => (
    <LinearGradient
        colors={['#3B82F6', '#60A5FA']}
        style={styles.card}
    >
        <Text style={styles.cardBrand}>VISA</Text>
        <Text style={styles.cardNumberDisplay}>
            {cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ').trim() : '**** **** **** ****'}
        </Text>
        <View style={styles.cardFooter}>
            <View>
                <Text style={styles.cardLabel}>Titular</Text>
                <Text style={styles.cardValue}>{holderName || 'NOME COMPLETO'}</Text>
            </View>
            <View>
                <Text style={styles.cardLabel}>Validade</Text>
                <Text style={styles.cardValue}>{expiryDate || 'MM/AA'}</Text>
            </View>
        </View>
    </LinearGradient>
);

export default function AddCardScreen() {
    const navigation = useNavigation();
    const [cardNumber, setCardNumber] = useState('');
    const [holderName, setHolderName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleCardNumberChange = (text) => {
        const formattedText = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(formattedText);
    };

    const handleExpiryDateChange = (text) => {
        let formattedText = text.replace(/[^0-9]/g, '');
        if (formattedText.length > 2) {
            formattedText = formattedText.slice(0, 2) + '/' + formattedText.slice(2, 4);
        }
        setExpiryDate(formattedText);
    };

    const handleAddCard = async () => {
        if (!cardNumber || !holderName || !expiryDate || !cvv) {
            Alert.alert("Erro", "Por favor, preencha todos os campos do cartão.");
            return;
        }
        const user = auth.currentUser;
        if (user) {
            try {
                await addDoc(collection(db, "users", user.uid, "cards"), {
                    cardNumber: cardNumber.replace(/\s/g, '').slice(-4),
                    holderName: holderName,
                    expiryDate: expiryDate,
                });
                Alert.alert("Sucesso", "Cartão adicionado!");
                navigation.goBack();
            } catch (error) {
                Alert.alert("Erro", "Não foi possível adicionar o cartão.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'   '}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Adicionar Cartão</Text>
                <View style={{ width: 30 }} />
            </View>

            <View style={styles.content}>
                <InteractiveCreditCard 
                    cardNumber={cardNumber}
                    holderName={holderName}
                    expiryDate={expiryDate}
                />

                <Text style={styles.label}>Nome do Titular</Text>
                <TextInput
                    style={styles.input}
                    placeholder="FULANO DE TAL"
                    value={holderName}
                    onChangeText={setHolderName}
                />

                <Text style={styles.label}>Número do Cartão</Text>
                <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9101 1121"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    keyboardType="numeric"
                    maxLength={19}
                />

                <View style={styles.row}>
                    <View style={styles.inputHalf}>
                        <Text style={styles.label}>Validade</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM/AA"
                            value={expiryDate}
                            onChangeText={handleExpiryDateChange}
                            keyboardType="numeric"
                            maxLength={5}
                        />
                    </View>
                    <View style={styles.inputHalf}>
                        <Text style={styles.label}>CVV</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123"
                            value={cvv}
                            onChangeText={setCvv}
                            keyboardType="numeric"
                            maxLength={3}
                            secureTextEntry
                        />
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleAddCard}>
                    <Text style={styles.submitButtonText}>Adicionar Cartão</Text>
                </TouchableOpacity>
            </View>
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
    },
    backButton: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: {
        flex: 1,
        padding: 20,
    },
    card: {
        borderRadius: 15,
        padding: 20,
        height: 200,
        marginBottom: 30,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    cardBrand: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
    },
    cardNumberDisplay: {
        color: '#FFFFFF',
        fontSize: 24,
        letterSpacing: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        color: '#E0E7FF',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    cardValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    label: { fontSize: 14, color: '#6B7280', marginBottom: 5, marginTop: 10 },
    input: { backgroundColor: '#FFFFFF', height: 50, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    inputHalf: { width: '48%' },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    submitButton: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 30, alignItems: 'center' },
    submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

