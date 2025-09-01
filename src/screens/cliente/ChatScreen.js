import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon'; // Usaremos o nosso componente de ícone

// --- Componente de Avatar (similar ao de MessagesScreen) ---
const UserAvatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const getColorByName = (name) => {
        let hash = 0;
        if (!name) return '#6B7280';
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        return colors[Math.abs(hash) % colors.length];
    };
    return (
        <View style={[styles.avatar, { backgroundColor: getColorByName(name) }]}>
            <Text style={styles.avatarText}>{initial}</Text>
        </View>
    );
};

export default function ChatScreen({ route }) {
    const { userName } = route.params;
    const navigation = useNavigation();
    const [messages, setMessages] = useState([
        { id: '3', text: 'Excelente! O progresso está em 45% conforme mostrado no dashboard. Precisa de algum ajuste?', sender: 'other' },
        { id: '2', text: 'Perfeito! Vou analisar e te dou um retorno ainda hoje.', sender: 'me' },
        { id: '1', text: 'Olá! Espero que esteja bem. Enviei uma atualização do projeto E-commerce para sua revisão.', sender: 'other' },
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim().length === 0) return;
        
        const newMessage = {
            id: (messages.length + 1).toString(),
            text: inputText,
            sender: 'me',
        };
        // Adiciona a nova mensagem no início da lista para aparecer em baixo (devido ao `inverted`)
        setMessages([newMessage, ...messages]);
        setInputText('');
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.sender === 'me';
        return (
            <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.otherMessageRow]}>
                {!isMyMessage && <UserAvatar name={userName} />}
                <View style={[styles.messageBubble, isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble]}>
                    <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="voltar" style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{userName}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* 1. A estrutura foi simplificada. A FlatList agora ocupa o espaço principal. */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.messageList}
                inverted
                contentContainerStyle={{paddingBottom: 10}}
            />

            {/* 2. O KeyboardAvoidingView agora envolve APENAS a barra de input, que é a melhor prática. */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} 
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Digite sua mensagem..."
                        placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Icon name="enviar" style={styles.sendIcon} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: { padding: 10 },
    backIcon: { width: 24, height: 24, tintColor: '#374151' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    // 3. O estilo da lista de mensagens foi ajustado para ocupar o espaço disponível.
    messageList: {
        flex: 1,
        paddingHorizontal: 10,
    },
    messageRow: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'flex-end',
    },
    myMessageRow: { justifyContent: 'flex-end' },
    otherMessageRow: { justifyContent: 'flex-start' },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    messageBubble: {
        maxWidth: '75%',
        padding: 15,
        borderRadius: 20,
    },
    myMessageBubble: {
        backgroundColor: '#3B82F6',
        borderBottomRightRadius: 5,
    },
    otherMessageBubble: {
        backgroundColor: '#E5E7EB',
        borderBottomLeftRadius: 5,
    },
    myMessageText: { color: '#FFFFFF' },
    otherMessageText: { color: '#1F2937' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        height: 45,
        backgroundColor: '#F3F4F6',
        borderRadius: 22,
        paddingHorizontal: 15,
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#3B82F6',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendIcon: { width: 22, height: 22, tintColor: '#FFFFFF' },
});

