import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput } from 'react-native';
import { auth, db } from '../../firebaseConfig';
// Adicionaremos a busca de projetos do Firestore mais tarde

// --- Componente para a Visão do Cliente ---
const ClientProjectsView = () => {
    // Dados de exemplo - no futuro, virão do Firestore
    const myProjects = [
        { id: '1', title: 'E-commerce App', status: 'Em Andamento', budget: '9.200' },
        { id: '2', title: 'Website Corporativo', status: 'Aguardando', budget: '4.500' },
        { id: '3', title: 'App Mobile', status: 'Entregue', budget: '12.000' },
    ];

    const renderProjectItem = ({ item }) => (
        <View style={styles.projectCard}>
            <View>
                <Text style={styles.projectTitle}>{item.title}</Text>
                <Text style={styles.projectBudget}>Orçamento: R$ {item.budget}</Text>
            </View>
            <Text style={[styles.statusBadge, styles[`status${item.status.replace(' ', '')}`]]}>{item.status}</Text>
        </View>
    );

    return (
        <View style={styles.viewContainer}>
            <TouchableOpacity style={styles.createProjectButton}>
                <Text style={styles.createProjectButtonText}>+ Postar Novo Projeto</Text>
            </TouchableOpacity>
            <FlatList
                data={myProjects}
                renderItem={renderProjectItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={<Text style={styles.listHeader}>Meus Projetos</Text>}
            />
        </View>
    );
};

// --- Componente para a Visão do Profissional ---
const ProfessionalProjectsView = () => {
    // Dados de exemplo
    const availableProjects = [
        { id: '1', title: 'Criação de Logotipo e Identidade Visual', category: 'Design', budget: '3.000' },
        { id: '2', title: 'Desenvolvimento de API REST com Node.js', category: 'Desenvolvimento', budget: '8.500' },
        { id: '3', title: 'Gestão de Campanhas de Tráfego Pago', category: 'Marketing', budget: '5.000' },
    ];

     const renderProjectItem = ({ item }) => (
        <TouchableOpacity style={styles.projectCard}>
            <Text style={styles.projectTitle}>{item.title}</Text>
            <View style={styles.projectFooter}>
                <Text style={styles.projectCategory}>{item.category}</Text>
                <Text style={styles.projectBudget}>Até R$ {item.budget}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.viewContainer}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por projetos..."
                />
            </View>
            <FlatList
                data={availableProjects}
                renderItem={renderProjectItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={<Text style={styles.listHeader}>Projetos Disponíveis</Text>}
            />
        </View>
    );
};


export default function ProjectsScreen({ route }) {
  // O userType é passado a partir do App.js
  const { userType } = route.params;

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Projetos</Text>
        </View>
        {userType === 'cliente' ? <ClientProjectsView /> : <ProfessionalProjectsView />}
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
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    viewContainer: {
        flex: 1,
        padding: 20,
    },
    // --- Estilos do Cliente ---
    createProjectButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    createProjectButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
    },
    projectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    projectBudget: {
        fontSize: 14,
        color: '#6B7280',
    },
    statusBadge: {
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    statusEmAndamento: { backgroundColor: '#DBEAFE', color: '#3B82F6' },
    statusAguardando: { backgroundColor: '#FEF3C7', color: '#F59E0B' },
    statusEntregue: { backgroundColor: '#D1FAE5', color: '#10B981' },
    // --- Estilos do Profissional ---
    searchContainer: {
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    projectFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    projectCategory: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: '#6B7280',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        overflow: 'hidden',
    },
});
