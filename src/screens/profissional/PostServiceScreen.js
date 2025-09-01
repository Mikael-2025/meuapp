import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PostServiceScreen() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const handlePostService = () => {
        if (!title || !description || !price) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }
        // Lógica para guardar o serviço no Firebase viria aqui
        Alert.alert("Sucesso!", "O seu serviço foi anunciado.");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Anunciar Serviço</Text>
                <View style={{ width: 30 }} />
            </View>
            <ScrollView style={styles.form}>
                <Text style={styles.label}>Título do Serviço</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Desenvolvimento de App iOS"
                    value={title}
                    onChangeText={setTitle}
                />
                <Text style={styles.label}>Descrição Detalhada</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Descreva as suas habilidades, o que está incluído no serviço, etc."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                <Text style={styles.label}>Preço (R$)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 5000"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.submitButton} onPress={handlePostService}>
                    <Text style={styles.submitButtonText}>Publicar Anúncio</Text>
                </TouchableOpacity>
            </ScrollView>
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
    backButton: { fontSize: 24, fontWeight: 'bold' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    form: { padding: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 10, marginTop: 15 },
    input: { backgroundColor: '#FFFFFF', minHeight: 50, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    textArea: { height: 120, textAlignVertical: 'top', paddingTop: 15 },
    submitButton: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 30 },
    submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
