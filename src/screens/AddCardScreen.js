import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

export default function AddCardScreen({ navigation }) {
    const [cardNumber, setCardNumber] = useState('');
    const [holderName, setHolderName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleAddCard = () => {
        if (!cardNumber || !holderName || !expiryDate || !cvv) {
            Alert.alert("Erro", "Por favor, preencha todos os campos do cartão.");
            return;
        }
        // Lógica para guardar o cartão de forma segura viria aqui.
        console.log({ cardNumber, holderName, expiryDate, cvv });
        Alert.alert("Sucesso", "Cartão adicionado!");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'Voltar'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Adicionar Novo Cartão</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Número do Cartão</Text>
                <TextInput
                    style={styles.input}
                    placeholder="**** **** **** ****"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                    maxLength={19}
                />

                <Text style={styles.label}>Nome no Cartão</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do Cartão"
                    value={holderName}
                    onChangeText={setHolderName}
                />

                <View style={styles.row}>
                    <View style={styles.inputHalf}>
                        <Text style={styles.label}>Validade</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM/AA"
                            value={expiryDate}
                            onChangeText={setExpiryDate}
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

                <TouchableOpacity style={styles.submitButton} onPress={handleAddCard}>
                    <Text style={styles.submitButtonText}>Adicionar Cartão</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFFFF' 
    },
    header: { 
        paddingTop: 50, 
        paddingBottom: 20, 
        paddingHorizontal: 10, 
        backgroundColor: '#FFFFFF', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: '#E5E7EB' 
    },
    backButton: { 
        fontSize: 16, 
        color: '#4F46E5', 
        fontWeight: '600' 
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#111827' 
    },
    form: { 
        padding: 20 
    },
    label: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#374151', 
        marginBottom: 8 
    },
    input: { 
        backgroundColor: '#F3F4F6', 
        height: 50, 
        borderRadius: 8, 
        paddingHorizontal: 15, 
        fontSize: 16, 
        marginBottom: 20, 
        borderWidth: 1, 
        borderColor: '#D1D5DB' 
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    inputHalf: { 
        width: '48%' 
    },
    submitButton: { 
        backgroundColor: '#4F46E5', 
        paddingVertical: 15, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginTop: 10 
    },
    submitButtonText: { 
        color: '#FFFFFF', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
});
