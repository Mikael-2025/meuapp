import React from 'react';
import { View, Text, Image } from 'react-native';

// Este componente recebe o nome do utilizador e o URL da imagem (se existir)
const UserAvatar = ({ name, imageUrl, size = 40 }) => {
    // Pega na primeira letra do nome
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    // Função para gerar uma cor com base no nome, para que cada utilizador tenha uma cor diferente
    const getColorByName = (name) => {
        if (!name) return '#6B7280'; // Cor padrão
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        return colors[Math.abs(hash) % colors.length];
    };

    // Estilos dinâmicos baseados no tamanho do avatar
    const containerStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: getColorByName(name),
        justifyContent: 'center',
        alignItems: 'center',
    };

    const textStyle = {
        color: '#FFFFFF',
        fontSize: size / 2,
        fontWeight: 'bold',
    };

    // Se houver um URL de imagem, mostra a imagem
    if (imageUrl) {
        return <Image source={{ uri: imageUrl }} style={containerStyle} />;
    }

    // Se não, mostra o avatar com a inicial
    return (
        <View style={containerStyle}>
            <Text style={textStyle}>{initial}</Text>
        </View>
    );
};

export default UserAvatar;
