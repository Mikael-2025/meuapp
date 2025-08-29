import React, { useState, useCallback } from 'react';
// 1. O ScrollView foi removido para que a FlatList seja o container principal, eliminando o aviso.
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, Dimensions, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Lista de cidades para o autocompletar
const BRAZILIAN_CITIES = [
    "Aracaju, SE", "Belém, PA", "Belo Horizonte, MG", "Boa Vista, RR", "Brasília, DF",
    "Campo Grande, MS", "Cuiabá, MT", "Curitiba, PR", "Florianópolis, SC", "Fortaleza, CE",
    "Goiânia, GO", "João Pessoa, PB", "Macapá, AP", "Maceió, AL", "Manaus, AM",
    "Natal, RN", "Palmas, TO", "Porto Alegre, RS", "Porto Velho, RO", "Recife, PE",
    "Rio Branco, AC", "Rio de Janeiro, RJ", "Salvador, BA", "São Luís, MA", "São Paulo, SP",
    "Teresina, PI", "Vitória, ES"
];

const { width: screenWidth } = Dimensions.get('window');

// 2. Os componentes do formulário foram separados para otimização
const FormHeader = ({ name, setName, email, setEmail, password, setPassword, phone, setPhone, location, handleLocationChange }) => (
    <>
        <Text style={styles.title}>Criar Conta</Text>
        <TextInput style={styles.input} placeholder="Nome Completo" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput 
            style={styles.input} 
            placeholder="Sua cidade / estado" 
            value={location} 
            onChangeText={handleLocationChange} 
        />
    </>
);

const FormFooter = ({ userType, setUserType, handleSignUp, isLoading, navigation }) => (
    <>
        <Text style={styles.typeSelectorLabel}>Eu sou:</Text>
        <View style={styles.typeSelectorContainer}>
            <TouchableOpacity 
                style={[styles.typeButton, userType === 'cliente' && styles.typeButtonSelected]}
                onPress={() => setUserType('cliente')}
            >
                <Text style={[styles.typeButtonText, userType === 'cliente' && styles.typeButtonTextSelected]}>Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.typeButton, userType === 'profissional' && styles.typeButtonSelected]}
                onPress={() => setUserType('profissional')}
            >
                <Text style={[styles.typeButtonText, userType === 'profissional' && styles.typeButtonTextSelected]}>Profissional</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp} disabled={isLoading}>
            <Text style={styles.primaryButtonText}>{isLoading ? 'A criar...' : 'CRIAR CONTA'}</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Faça login aqui</Text>
            </TouchableOpacity>
        </View>
    </>
);


export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [userType, setUserType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredCities, setFilteredCities] = useState([]);

    const handleLocationChange = (text) => {
        setLocation(text);
        if (text) {
            const suggestions = BRAZILIAN_CITIES.filter(city => city.toLowerCase().includes(text.toLowerCase()));
            setFilteredCities(suggestions);
        } else {
            setFilteredCities([]);
        }
    };

    const onCitySelect = (city) => {
        setLocation(city);
        setFilteredCities([]);
    };

    const handleSignUp = () => {
        if (!name || !email || !password || !userType || !phone || !location) {
            Alert.alert("Erro", "Por favor, preencha todos os campos e selecione um tipo de perfil.");
            return;
        }
        setIsLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                setDoc(doc(db, "users", user.uid), { name, email, userType, phone, location, profilePictureUrl: null });
            })
            .catch(error => Alert.alert("Erro no Cadastro", error.message))
            .finally(() => setIsLoading(false));
    };

    const curvePath = `M0,0 L0,150 Q${screenWidth / 2},220 ${screenWidth},150 L${screenWidth},0 Z`;

    // 3. O 'useCallback' otimiza o FlatList para evitar que ele se redesenhe a cada letra digitada, corrigindo o bug de travamento.
    const renderSuggestionItem = useCallback(({ item }) => (
        <TouchableOpacity style={styles.suggestionItem} onPress={() => onCitySelect(item)}>
            <Text>{item}</Text>
        </TouchableOpacity>
    ), []);

    // O conteúdo da lista é composto por um cabeçalho (a maioria do formulário), a lista de cidades, e um rodapé (o resto do formulário).
    const listContent = [
        { type: 'header', id: 'header' },
        ...filteredCities.map(city => ({ type: 'city', id: city })),
        { type: 'footer', id: 'footer' }
    ];

    const renderItem = useCallback(({ item }) => {
        if (item.type === 'header') {
            return <FormHeader {...{ name, setName, email, setEmail, password, setPassword, phone, setPhone, location, handleLocationChange }} />;
        }
        if (item.type === 'city') {
            return renderSuggestionItem({ item: item.id });
        }
        if (item.type === 'footer') {
            return <FormFooter {...{ userType, setUserType, handleSignUp, isLoading, navigation }} />;
        }
        return null;
    }, [name, email, password, phone, location, userType, isLoading, filteredCities]); // Dependências para redesenhar

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
                        <Path d={curvePath} fill="#3B82F6" />
                    </Svg>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>{''}</Text>
                    </TouchableOpacity>
                </View>

                {/* A FlatList agora controla toda a rolagem da tela */}
                <FlatList
                    style={styles.formContainer}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    data={listContent}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    headerContainer: { height: 200 },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 1 },
    backButtonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
    formContainer: {
        marginTop: -50,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 20, paddingTop: 30 },
    input: { backgroundColor: '#F3F4F6', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10, marginBottom: 15, fontSize: 16 },
    suggestionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        // Estilo ligeiramente diferente para se destacar dos inputs
        backgroundColor: '#FAFAFA' 
    },
    typeSelectorLabel: { fontSize: 14, color: '#6B7280', marginBottom: 10, marginTop: 5 },
    typeSelectorContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    typeButton: { flex: 1, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', marginHorizontal: 5 },
    typeButtonSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
    typeButtonText: { color: '#374151', fontWeight: '600' },
    typeButtonTextSelected: { color: '#FFFFFF' },
    primaryButton: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { fontSize: 14, color: '#6B7280' },
    footerLink: { fontSize: 14, color: '#3B82F6', fontWeight: 'bold' },
});

