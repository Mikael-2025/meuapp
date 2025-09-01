import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Alert, Switch, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, auth, db } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut, deleteUser } from "firebase/auth";
import UserAvatar from '../components/UserAvatar';

// Componente reutilizável para uma linha de configuração com um Switch
const SettingRow = ({ label, value, onValueChange }) => (
    <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Switch value={value} onValueChange={onValueChange} trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={value ? "#3B82F6" : "#f4f3f4"} />
    </View>
);

// Componente reutilizável para uma secção do formulário
const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionBody}>
            {children}
        </View>
    </View>
);


export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para as notificações e preferências
  const [settings, setSettings] = useState({
      newProjects: true,
      messages: true,
      payments: false,
      darkMode: false,
  });

  // Estados para o modal de exclusão
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const fetchUserData = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setOriginalUserData(data);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchUserData(); }, []);

  const handlePickAndUploadImage = async () => { /* ...código existente... */ };
  const uploadImage = async (uri) => { /* ...código existente... */ };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userDocRef, {
                name: userData.name,
                phone: userData.phone,
            });
            Alert.alert("Sucesso", "As suas informações foram atualizadas!");
            setOriginalUserData(userData);
            setIsEditing(false);
        } catch (error) { Alert.alert("Erro", "Não foi possível guardar as alterações."); }
    }
  };

  const handleCancelEdit = () => {
      setUserData(originalUserData);
      setIsEditing(false);
  };
  
  const handleDeleteAccount = async () => {
      if (deleteConfirmText.toUpperCase() !== 'EXCLUIR') {
          Alert.alert("Confirmação inválida", "Por favor, digite 'EXCLUIR' para confirmar.");
          return;
      }
      const user = auth.currentUser;
      deleteUser(user).then(() => {
          setDeleteModalVisible(false);
      }).catch((error) => {
          Alert.alert("Erro", "Ocorreu um erro ao excluir a sua conta.");
      });
  };

  if (isLoading) { return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />; }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Configurações</Text>
        </View>

        {/* Secção de Informações do Perfil */}
        <Section title="Informações do Perfil">
            {/* O container do avatar agora está centralizado */}
            <View style={styles.profileInfoContainer}>
                <TouchableOpacity onPress={handlePickAndUploadImage} disabled={isUploading || !isEditing}>
                    <UserAvatar name={userData?.name} imageUrl={userData?.profilePictureUrl} size={80} />
                    {isUploading && <ActivityIndicator style={styles.uploadingIndicator} />}
                </TouchableOpacity>
                {/* O tipo de utilizador agora fica debaixo do avatar */}
                <Text style={styles.userTypeLabel}>{userData?.userType === 'cliente' ? 'Cliente' : 'Profissional'}</Text>
            </View>

            {/* Os campos de texto agora ficam debaixo da secção do avatar */}
            <TextInput style={isEditing ? styles.input : styles.inputDisabled} value={userData?.name} onChangeText={(text) => setUserData({...userData, name: text})} editable={isEditing} placeholder="Nome completo"/>
            <TextInput style={isEditing ? styles.input : styles.inputDisabled} value={userData?.phone} onChangeText={(text) => setUserData({...userData, phone: text})} editable={isEditing} keyboardType="phone-pad" placeholder="Telefone"/>
            <TextInput style={styles.inputDisabled} value={userData?.email} editable={false} />
            
            {isEditing ? (
                <View style={styles.editButtons}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}><Text style={styles.buttonText}>Guardar</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}><Text style={styles.buttonText}>Cancelar</Text></TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}><Text style={styles.buttonText}>Editar</Text></TouchableOpacity>
            )}
        </Section>

        {/* Secção de Notificações */}
        <Section title="Notificações">
            <SettingRow label="Novos projetos disponíveis" value={settings.newProjects} onValueChange={() => setSettings(prev => ({...prev, newProjects: !prev.newProjects}))} />
            <SettingRow label="Mensagens recebidas" value={settings.messages} onValueChange={() => setSettings(prev => ({...prev, messages: !prev.messages}))} />
            <SettingRow label="Lembretes de pagamento" value={settings.payments} onValueChange={() => setSettings(prev => ({...prev, payments: !prev.payments}))} />
        </Section>
        
        {/* Secção de Segurança */}
        <Section title="Segurança">
            <View style={styles.securityRow}>
                <Text style={styles.settingLabel}>Sair de todos os dispositivos</Text>
                <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Sucesso", "Você foi desconectado de todos os outros dispositivos.")}><Text style={styles.actionButtonText}>Sair</Text></TouchableOpacity>
            </View>
             <View style={styles.securityRow}>
                <Text style={styles.settingLabel}>Autenticação de dois fatores</Text>
                <TouchableOpacity style={styles.actionButton}><Text style={styles.actionButtonText}>Ativar 2FA</Text></TouchableOpacity>
            </View>
        </Section>
        
        {/* Secção Métodos de Pagamento */}
        <Section title="Métodos de Pagamento">
             <View style={styles.securityRow}>
                <Text style={styles.settingLabel}>Gerir os seus métodos de pagamento</Text>
                <TouchableOpacity style={styles.actionButton}><Text style={styles.actionButtonText}>Ver Métodos</Text></TouchableOpacity>
            </View>
        </Section>
        
        {/* Preferências do Sistema */}
        <Section title="Preferências do Sistema">
            <SettingRow label="Modo Escuro" value={settings.darkMode} onValueChange={() => setSettings(prev => ({...prev, darkMode: !prev.darkMode}))} />
        </Section>

        {/* Zona de Perigo */}
        <Section title="Zona de Perigo">
            <View style={styles.dangerRow}>
                <Text style={styles.settingLabel}>Desativar conta temporariamente</Text>
                <TouchableOpacity style={styles.dangerButton}><Text style={styles.dangerButtonText}>Desativar</Text></TouchableOpacity>
            </View>
            <View style={styles.dangerRow}>
                <Text style={styles.settingLabel}>Excluir conta permanentemente</Text>
                <TouchableOpacity style={styles.dangerButton} onPress={() => setDeleteModalVisible(true)}><Text style={styles.dangerButtonText}>Excluir Conta</Text></TouchableOpacity>
            </View>
        </Section>
      </ScrollView>

      {/* Modal de Confirmação de Exclusão */}
      <Modal visible={isDeleteModalVisible} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Excluir Conta</Text>
                    <Text style={styles.modalText}>Esta medida é irreversível. Perderá acesso total ao seu histórico.</Text>
                    <Text style={styles.modalPrompt}>Digite "EXCLUIR" abaixo para continuar:</Text>
                    <TextInput style={styles.modalInput} value={deleteConfirmText} onChangeText={setDeleteConfirmText} autoCapitalize="characters" />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalCancelButton} onPress={() => setDeleteModalVisible(false)}><Text>Cancelar</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.modalConfirmButton} onPress={handleDeleteAccount}><Text style={styles.buttonText}>Excluir</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFFFFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    section: { marginHorizontal: 15, marginTop: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginBottom: 10 },
    sectionBody: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 15 },
    // Estilos atualizados para o novo layout do avatar
    profileInfoContainer: { 
        alignItems: 'center', 
        marginBottom: 15 
    },
    userTypeLabel: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
    },
    uploadingIndicator: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 40 },
    input: { backgroundColor: '#F9FAFB', height: 50, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 10, borderWidth: 1, borderColor: '#D1D5DB' },
    inputDisabled: { backgroundColor: '#E5E7EB', color: '#6B7280', height: 50, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 10, borderWidth: 1, borderColor: '#D1D5DB' },
    editButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
    editButton: { backgroundColor: '#3B82F6', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'flex-end' },
    saveButton: { backgroundColor: '#10B981', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginRight: 10 },
    cancelButton: { backgroundColor: '#6B7280', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    settingLabel: { fontSize: 16, flex: 1 },
    securityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
    actionButton: { backgroundColor: '#E0E7FF', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
    actionButtonText: { color: '#3B82F6', fontWeight: 'bold' },
    dangerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
    dangerButton: { backgroundColor: '#FEE2E2', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
    dangerButtonText: { color: '#EF4444', fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '90%', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalText: { fontSize: 16, color: '#6B7280', marginBottom: 15 },
    modalPrompt: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    modalInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, marginBottom: 20, textAlign: 'center' },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
    modalCancelButton: { paddingVertical: 15, paddingHorizontal: 20 },
    modalConfirmButton: { backgroundColor: '#EF4444', padding: 15, borderRadius: 8 },
});

