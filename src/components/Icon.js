import React from 'react';
import { Image, StyleSheet } from 'react-native';

// Este é o nosso componente de ícone reutilizável.
// Ele carrega as imagens PNG da sua pasta de assets.
const Icon = ({ name, focused, style }) => {
    const icons = {
        // Ícones da Tab Bar (Cliente e Profissional)
        'home': require('../../assets/icons/casa.png'),
        'projetos': require('../../assets/icons/projetos.png'),
        // A linha para o ícone de propostas foi adicionada aqui
        'propostas': require('../../assets/icons/proposta.png'),
        'mensagens': require('../../assets/icons/mensagem.png'),
        'perfil': require('../../assets/icons/perfil.png'),
        'pagamentos': require('../../assets/icons/pagamentos.png'),
        'plus': require('../../assets/icons/plus.png'),

        // Ícones dos StatCards e outros
        'investimento': require('../../assets/icons/investimento.png'),
        'profissionais': require('../../assets/icons/profissionais.png'),
        'avaliacao': require('../../assets/icons/avaliacao.png'),
        'concluido': require('../../assets/icons/concluido.png'),
        'fatura': require('../../assets/icons/fatura.png'),
        'receber': require('../../assets/icons/receber.png'),
        'buscar': require('../../assets/icons/buscar.png'),
 
        
        // Ícones do ChatScreen e Modals
        'enviar': require('../../assets/icons/enviar.png'),
        'check': require('../../assets/icons/concluido.png'),
    };

    if (!icons[name]) return null;

    // A propriedade 'focused' vem do Tab Navigator e diz-nos se a aba está ativa.
    // Usamos isso para mudar a cor do ícone (funciona melhor com PNGs brancos).
    const imageStyle = [
        styles.icon,
        style,
        focused !== undefined && { tintColor: focused ? '#3B82F6' : '#9CA3AF' },
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

