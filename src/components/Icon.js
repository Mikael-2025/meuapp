import React from 'react';
import { Image, StyleSheet } from 'react-native';

// Este é o nosso componente de ícone reutilizável.
// Ele carrega as imagens PNG da sua pasta de assets.
const Icon = ({ name, focused, style }) => {
    const icons = {
        // Ícones da Tab Bar - Caminhos corrigidos para ../../
        'home': require('../../assets/icons/casa.png'),
        'projetos': require('../../assets/icons/projetos.png'),
        'mensagens': require('../../assets/icons/mensagem.png'),
        'perfil': require('../../assets/icons/perfil.png'),
        'pagamentos': require('../../assets/icons/pagamentos.png'),

        // Ícones dos StatCards - Caminhos corrigidos para ../../
        'investimento': require('../../assets/icons/investimento.png'),
        'profissionais': require('../../assets/icons/profissionais.png'),
        'avaliacao': require('../../assets/icons/avaliacao.png'),
        'plus': require('../../assets/icons/plus.png'),
    };

    if (!icons[name]) return null;

    // A propriedade 'focused' vem do Tab Navigator e diz-nos se a aba está ativa.
    // Usamos isso para mudar a cor do ícone (funciona melhor com PNGs brancos).
    const imageStyle = [
        styles.icon,
        style,
        // Se o ícone estiver focado (ativo), usa a cor primária, senão, usa cinzento.
        { tintColor: focused ? '#4F46E5' : '#9CA3AF' }
    ];

    return <Image source={icons[name]} style={imageStyle} />;
};

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
});

export default Icon;
