import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

// --- Ícone de placeholder ---
const Icon = ({ name, style }) => {
    const icons = { 'camera': '📷', 'save': '💾', 'logout': '🚪' };
    return <Text style={[styles.icon, style]}>{icons[name] || '❓'}</Text>;
};

export default function PerfilScreen() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Para controlar o modo de edição

  // Função para buscar os dados do utilizador no Firestore
  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    }
    setIsLoading(false);
  };

  // Busca os dados quando a tela é carregada
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  // Função para guardar as alterações (ainda não implementada)
  const handleSaveChanges = async () => {
      // Lógica para guardar os dados no Firestore virá aqui
      Alert.alert("Sucesso", "Informações atualizadas!");
      setIsEditing(false);
  };

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
        </View>

        {/* Foto de Perfil */}
        <View style={styles.profilePicContainer}>
          <Image 
            source={{ uri: userData?.profilePictureUrl || 'https://placehold.co/150x150/E0E7FF/1E40AF?text=👤' }} 
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Icon name="camera" style={styles.cameraIcon} />
          </TouchableOpacity>
        </View>

        {/* Formulário de Informações */}
        <View style={styles.form}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput 
                style={styles.input}
                value={userData?.name}
                // onChangeText={(text) => setUserData({...userData, name: text})}
                placeholder="Seu nome completo"
                editable={isEditing}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput 
                style={[styles.input, styles.inputDisabled]}
                value={userData?.email}
                placeholder="seu@email.com"
                editable={false} // Email não pode ser editado
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput 
                style={styles.input}
                value={userData?.phone}
                // onChangeText={(text) => setUserData({...userData, phone: text})}
                placeholder="(00) 00000-0000"
                editable={isEditing}
                keyboardType="phone-pad"
            />

            <Text style={styles.label}>Localização</Text>
            <TextInput 
                style={styles.input}
                value={userData?.location}
                // onChangeText={(text) => setUserData({...userData, location: text})}
                placeholder="Sua cidade"
                editable={isEditing}
            />
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Icon name="save" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Guardar Alterações</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="logout" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Sair (Logout)</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
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
    profilePicContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: '30%',
        backgroundColor: '#4F46E5',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    cameraIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    form: {
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#FFFFFF',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    inputDisabled: {
        backgroundColor: '#F3F4F6',
        color: '#6B7280',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    buttonIcon: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    icon: { fontSize: 18 },
});
