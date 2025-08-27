import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { auth, db } from '../../firebaseConfig';
// Funções do Firestore para adicionar dados
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

export default function CreateProjectScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [category, setCategory] = useState(''); // Ex: 'Desenvolvimento', 'Design'

    const handleCreateProject = async () => {
        if (!title || !description || !budget || !category) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        try {
            const user = auth.currentUser;
            // Adiciona um novo documento à coleção "projects"
            await addDoc(collection(db, "projects"), {
                title: title,
                description: description,
                budget: parseFloat(budget), // Guarda como número
                category: category,
                status: 'Aguardando', // Status inicial
                clientId: user.uid, // Liga o projeto ao cliente atual
                createdAt: serverTimestamp(), // Guarda a data de criação
            });

            Alert.alert("Sucesso!", "O seu projeto foi postado.");
            navigation.goBack(); // Volta para a tela anterior

        } catch (error) {
            console.error("Erro ao criar projeto: ", error);
            Alert.alert("Erro", "Não foi possível postar o seu projeto.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>{'< Voltar'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Novo Projeto</Text>
                    <View style={{ width: 50 }} />
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Título do Projeto</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Criar um aplicativo de delivery"
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

                    <Text style={styles.label}>Orçamento (R$)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 5000"
                        value={budget}
                        onChangeText={setBudget}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Categoria</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Desenvolvimento, Design, Marketing"
                        value={category}
                        onChangeText={setCategory}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleCreateProject}>
                        <Text style={styles.submitButtonText}>Publicar Projeto</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
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
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        fontSize: 16,
        color: '#4F46E5',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
