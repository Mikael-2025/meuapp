import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';

// Dados de exemplo para as mensagens
const messagesData = [
    { id: '1', text: 'Olá! Espero que esteja bem. Enviei uma atualização do projeto E-commerce App para sua revisão.', sender: 'other', time: '10:28' },
    { id: '2', text: 'Perfeito! Vou analisar e te dou um retorno ainda hoje.', sender: 'me', time: '10:29' },
    { id: '3', text: 'Excelente! O progresso está em 45% conforme mostrado no dashboard. Precisa de algum ajuste?', sender: 'other', time: '10:30' },
];

const MessageBubble = ({ item }) => (
    <View style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.myMessageContainer : styles.otherMessageContainer
    ]}>
        <View style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
            <Text style={
                item.sender === 'me' ? styles.myMessageText : styles.otherMessageText
            }>{item.text}</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
    </View>
);

export default function ChatScreen({ route, navigation }) {
    // Recebe os dados da conversa da tela anterior
    const { userName, avatar } = route.params;
    const [messages, setMessages] = useState(messagesData);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim().length > 0) {
            const newMessage = {
                id: (messages.length + 1).toString(),
                text: inputText,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setInputText('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Cabeçalho do Chat */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>{' Voltar'}</Text>
                </TouchableOpacity>
                <View style={styles.headerProfile}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <Text style={styles.headerTitle}>{userName}</Text>
                </View>
                <View style={{width: 60}} />
            </View>

            {/* Lista de Mensagens */}
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <MessageBubble item={item} />}
                style={styles.messageList}
                inverted // Começa a lista de baixo para cima
            />

            {/* Input de Mensagem */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Digite sua mensagem..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
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
        paddingBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButtonContainer: {
        padding: 5, // Aumenta a área de toque
    },
    backButtonText: {
        fontSize: 16,
        color: '#4F46E5',
        fontWeight: '600',
    },
    headerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    messageList: {
        flex: 1,
        paddingHorizontal: 10,
    },
    messageContainer: {
        marginVertical: 5,
        maxWidth: '80%',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 18,
    },
    myMessageBubble: {
        backgroundColor: '#4F46E5',
    },
    otherMessageBubble: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    myMessageText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    otherMessageText: {
        color: '#111827',
        fontSize: 16,
    },
    timeText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    textInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
