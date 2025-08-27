import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, FlatList, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';

import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


const CIDADES = [
  { id: '1', nome: 'Aracaju, SE' }, { id: '2', nome: 'Belém, PA' }, { id: '3', nome: 'Belo Horizonte, MG' }, { id: '4', nome: 'Boa Vista, RR' }, { id: '5', nome: 'Brasília, DF' }, { id: '6', nome: 'Campo Grande, MS' }, { id: '7', nome: 'Cuiabá, MT' }, { id: '8', nome: 'Curitiba, PR' }, { id: '9', nome: 'Florianópolis, SC' }, { id: '10', nome: 'Fortaleza, CE' }, { id: '11', nome: 'Goiânia, GO' }, { id: '12', nome: 'João Pessoa, PB' }, { id: '13', nome: 'Macapá, AP' }, { id: '14', nome: 'Maceió, AL' }, { id: '15', nome: 'Manaus, AM' }, { id: '16', nome: 'Natal, RN' }, { id: '17', nome: 'Palmas, TO' }, { id: '18', nome: 'Porto Alegre, RS' }, { id: '19', nome: 'Porto Velho, RO' }, { id: '20', nome: 'Recife, PE' }, { id: '21', nome: 'Rio Branco, AC' }, { id: '22', nome: 'Rio de Janeiro, RJ' }, { id: '23', nome: 'Salvador, BA' }, { id: '24', nome: 'São Luís, MA' }, { id: '25', nome: 'São Paulo, SP' }, { id: '26', nome: 'Teresina, PI' }, { id: '27', nome: 'Vitória, ES' },
];

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefone, setTelefone] = useState('');
  const [userType, setUserType] = useState('cliente');
  const [location, setLocation] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
        Alert.alert("Erro", "Por favor, preencha os campos obrigatórios (*).");
        return;
    }
    setIsLoading(true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            phone: telefone,
            location: location,
            userType: userType,
            profilePictureUrl: null,
            createdAt: new Date(),
        });

        // Não precisamos de desativar o isLoading ou navegar manualmente.
        // O "ouvinte" no App.js irá gerir a mudança de tela automaticamente.
        // Alert.alert("Sucesso!", "A sua conta foi criada.");
        // navigation.navigate('Login'); // <-- LINHA REMOVIDA

    } catch (error) {
        setIsLoading(false);
        console.error("Erro no cadastro: ", error);
        Alert.alert("Erro no Cadastro", error.message);
    }
  };


  const onSelectCity = (cidade) => {
    setLocation(cidade.nome);
    setModalVisible(false);
  };

  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Desculpe, precisamos da permissão da câmara para isto funcionar!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione uma Cidade</Text>
            <FlatList
              data={CIDADES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cityItem} onPress={() => onSelectCity(item)}>
                  <Text style={styles.cityText}>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Informações Básicas</Text>
      <Text style={styles.subtitle}>Conte-nos um pouco sobre você</Text>

      <View style={styles.row}>
        <TextInput 
          placeholder="Nome Completo *" 
          style={[styles.input, styles.inputHalf]} 
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName} 
        />
        <TextInput 
          placeholder="Email *" 
          style={[styles.input, styles.inputHalf]} 
          placeholderTextColor="#666" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.row}>
        <TextInput 
          placeholder="Telefone" 
          style={[styles.input, styles.inputHalf]} 
          placeholderTextColor="#666" 
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
        <TouchableOpacity 
          style={[styles.input, styles.inputHalf, styles.locationButton]}
          onPress={() => setModalVisible(true)}
        >
            <Text style={styles.locationButtonText}>
              {location || 'Selecione sua cidade'}
            </Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        placeholder="Senha *"
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Foto de Perfil</Text>
      <View style={styles.profilePicContainer}>
          <View style={styles.avatarPlaceholder}>
            <Image 
                source={{ uri: profileImage || 'https://placehold.co/100x100/E0E7FF/1E40AF?text=👤' }} 
                style={styles.avatarImage} 
            />
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImageAsync}>
              <Text style={styles.uploadButtonText}>Carregar Foto</Text>
          </TouchableOpacity>
      </View>

      <Text style={styles.label}>Eu sou:</Text>
      <View style={styles.userTypeContainer}>
        <TouchableOpacity 
          style={[styles.userTypeButton, userType === 'cliente' && styles.userTypeButtonSelected]}
          onPress={() => setUserType('cliente')}
        >
          <Text style={[styles.userTypeText, userType === 'cliente' && styles.userTypeTextSelected]}>Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.userTypeButton, userType === 'profissional' && styles.userTypeButtonSelected]}
          onPress={() => setUserType('profissional')}
        >
          <Text style={[styles.userTypeText, userType === 'profissional' && styles.userTypeTextSelected]}>Profissional</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
        {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
        ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.text}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Faça login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  inputHalf: {
      width: '48%',
  },
  locationButton: {
      justifyContent: 'center',
  },
  locationButtonText: {
      color: '#333',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  profilePicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
  },
  uploadButton: {
      backgroundColor: '#2563EB',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 6,
  },
  uploadButtonText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  userTypeContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userTypeButton: {
    width: '48%',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTypeButtonSelected: {
    backgroundColor: '#E0E7FF',
    borderColor: '#2563EB',
  },
  userTypeText: {
    fontSize: 14,
    color: '#333',
  },
  userTypeTextSelected: {
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#2563EB",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  link: {
    color: "#2563EB",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  cityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cityText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
