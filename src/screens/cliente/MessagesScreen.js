import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 1. Criei um novo componente reutilizável para o avatar
const UserAvatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
        </View>
    );
};


const ConversationCard = ({ item }) => {
    const navigation = useNavigation();
    return (
        // O onPress agora leva para a tela de Chat, passando o nome do utilizador
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Chat', { userName: item.userName })}>
            {/* 2. Adicionei o novo componente de avatar aqui */}
            <UserAvatar name={item.userName} />
            <View style={styles.textContainer}>
                <View style={styles.cardHeader}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default function MessagesScreen() {
    const MOCK_CONVERSATIONS = [
        { id: '1', userName: 'Ricardo Silva', lastMessage: 'Olá Anax! Espero que esteja bem. Enviei uma atualização...', timestamp: '10:30' },
        { id: '2', userName: 'Juliana Costa', lastMessage: 'Os wireframes estão prontos para revisão.', timestamp: '09:15' },
        { id: '3', userName: 'Carlos Santos', lastMessage: 'App Mobile concluído com sucesso!', timestamp: 'Ontem' },
        { id: '4', userName: 'Marina Oliveira', lastMessage: 'Relatório de dados enviado.', timestamp: '2 dias' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mensagens</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar conversas..."
                />
            </View>

            <FlatList
                data={MOCK_CONVERSATIONS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ConversationCard item={item} />}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, alignItems: 'center' },
    headerTitle: { fontSize: 22, fontWeight: 'bold' },
    searchContainer: { paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    searchInput: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 15, fontSize: 16 },
    card: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        alignItems: 'center',
    },
    // 3. Estilos para o novo avatar
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3B82F6', // Fundo azul
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    lastMessage: {
        fontSize: 14,
        color: '#6B7280',
    },
});
