import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AvaliacaoScreen({ route }) {
    const navigation = useNavigation();
    // 1. A correção principal está aqui. Adicionamos `|| {}` para o caso de a tela
    // ser acedida sem parâmetros, evitando que o aplicativo quebre.
    const { projectId, professionalName } = route.params || {};

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSaveReview = () => {
        if (rating === 0) {
            Alert.alert("Avaliação incompleta", "Por favor, selecione pelo menos uma estrela.");
            return;
        }
        // Lógica para guardar a avaliação no Firebase viria aqui
        Alert.alert("Obrigado!", "A sua avaliação foi enviada com sucesso.");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Avaliar Profissional</Text>
            </View>
            <ScrollView style={styles.content}>
                <Text style={styles.prompt}>Como foi a sua experiência com</Text>
                {/* 2. Adicionada uma verificação para o caso de o nome não ser encontrado. */}
                <Text style={styles.professionalName}>{professionalName || 'o profissional'}?</Text>

                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setRating(star)}>
                            <Text style={[styles.star, rating >= star ? styles.starSelected : {}]}>★</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TextInput
                    style={styles.commentInput}
                    placeholder="Deixe um comentário sobre o serviço (opcional)..."
                    value={comment}
                    onChangeText={setComment}
                    multiline
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSaveReview}>
                    <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFFFFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20 },
    prompt: { fontSize: 18, textAlign: 'center', color: '#4B5563' },
    professionalName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10, color: '#3B82F6' },
    starsContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 30 },
    star: { fontSize: 40, color: '#D1D5DB', marginHorizontal: 5 },
    starSelected: { color: '#FBBF24' },
    commentInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        height: 150,
        padding: 15,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: 30,
    },
    submitButton: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 10, alignItems: 'center' },
    submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

