import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateProjectScreen() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [budget, setBudget] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePublishProject = async () => {
        if (!title || !description || !category || !budget) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Erro", "Você precisa estar logado para postar um projeto.");
            return;
        }

        setIsLoading(true);
        try {
            await addDoc(collection(db, "projects"), {
                clientId: user.uid,
                title,
                description,
                category,
                budget,
                status: 'Aberto',
                createdAt: serverTimestamp(),
            });
            Alert.alert("Sucesso!", "O seu projeto foi publicado.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível publicar o seu projeto.");
            console.error("Erro ao adicionar projeto: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'              '}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Criar Novo Projeto</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>Título do Projeto</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: App de delivery para restaurante"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Descrição Detalhada</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Descreva o que você precisa, funcionalidades, etc."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={styles.label}>Categoria</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Desenvolvimento Mobile"
                    value={category}
                    onChangeText={setCategory}
                />

                <Text style={styles.label}>Orçamento (R$)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 10000"
                    value={budget}
                    onChangeText={setBudget}
                    keyboardType="numeric"
                />

                <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handlePublishProject}
                    disabled={isLoading}
                >
                    <Text style={styles.submitButtonText}>{isLoading ? 'A publicar...' : 'Publicar Projeto'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
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
    backButton: { fontSize: 16, color: '#4F46E5' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    form: { padding: 20 },
    label: { fontSize: 16, color: '#374151', marginBottom: 8, marginTop: 15 },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
