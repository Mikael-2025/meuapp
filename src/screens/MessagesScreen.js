import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';

// Dados de exemplo para as conversas
const conversations = [
    { id: '1', name: 'Ricardo Silva', message: 'Enviou uma atualização do projeto E-commerce...', time: '10:30', unread: 1, online: true, avatar: 'https://placehold.co/100x100/DBEAFE/3B82F6?text=RS' },
    { id: '2', name: 'Juliana Costa', message: 'Os wireframes estão prontos para revisão', time: '09:15', unread: 2, online: false, avatar: 'https://placehold.co/100x100/FEE2E2/EF4444?text=JC' },
    { id: '3', name: 'Carlos Santos', message: 'App Mobile concluído com sucesso!', time: 'Ontem', unread: 0, online: false, avatar: 'https://placehold.co/100x100/D1FAE5/10B981?text=CS' },
    { id: '4', name: 'Marina Oliveira', message: 'Relatório de dados enviado', time: '2 dias', unread: 0, online: true, avatar: 'https://placehold.co/100x100/FEF3C7/F59E0B?text=MO' },
];

const ConversationItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.conversationItem} onPress={onPress}>
        <View style={styles.avatarContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            {item.online && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.conversationContent}>
            <View style={styles.conversationHeader}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            <View style={styles.messageRow}>
                <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
                {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                )}
            </View>
        </View>
    </TouchableOpacity>
);

export default function MessagesScreen({ navigation }) {
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
                data={conversations}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ConversationItem 
                        item={item} 
                        // Navega para a tela de Chat, passando os dados da conversa
                        onPress={() => navigation.navigate('Chat', { 
                            userName: item.name, 
                            avatar: item.avatar 
                        })} 
                    />
                )}
            />
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
    searchContainer: {
        padding: 15,
        backgroundColor: '#FFFFFF',
    },
    searchInput: {
        backgroundColor: '#F3F4F6',
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    conversationItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    onlineIndicator: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 12,
        color: '#6B7280',
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    message: {
        fontSize: 14,
        color: '#6B7280',
        flex: 1,
    },
    unreadBadge: {
        backgroundColor: '#4F46E5',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    unreadText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
