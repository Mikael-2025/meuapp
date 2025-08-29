import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Alert, Switch, Modal } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

// --- Componentes Reutilizáveis para a tela ---

const SectionCard = ({ title, subtitle, children }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
        <View style={styles.cardContent}>
            {children}
        </View>
    </View>
);

const InfoRow = ({ label, value, placeholder, onChangeText, editable }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <TextInput
            style={[styles.infoInput, !editable && styles.inputDisabled]}
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
            editable={editable}
        />
    </View>
);

const ToggleRow = ({ label, value, onValueChange }) => (
    <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Switch
            trackColor={{ false: "#767577", true: "#818CF8" }}
            thumbColor={value ? "#4F46E5" : "#f4f3f4"}
            onValueChange={onValueChange}
            value={value}
        />
    </View>
);

const ActionRow = ({ label, description, buttonText, onPress, danger }) => (
    <View style={styles.settingRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.settingLabel}>{label}</Text>
            {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
        <TouchableOpacity style={[styles.actionButton, danger && styles.dangerButton]} onPress={onPress}>
            <Text style={[styles.actionButtonText, danger && styles.dangerButtonText]}>{buttonText}</Text>
        </TouchableOpacity>
    </View>
);


export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [notifications, setNotifications] = useState({
      newProjects: true,
      messages: true,
      updates: false,
  });

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

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userDocRef, { name: userData.name, phone: userData.phone, bio: userData.bio || '' });
            Alert.alert("Sucesso", "As suas informações foram atualizadas!");
            setOriginalUserData(userData);
            setIsEditing(false);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível guardar as alterações.");
        }
    }
  };
  
  const handleCancelEdit = () => { setUserData(originalUserData); setIsEditing(false); };

  const handleDeleteAccount = () => {
    console.log("Utilizador confirmou a exclusão.");
    // A lógica de exclusão real (deleteUser) é mais complexa.
    // Por agora, estamos a fazer logout como placeholder da ação.
    signOut(auth);
    setDeleteModalVisible(false);
    setDeleteConfirmText('');
  };

  if (isLoading) { return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />; }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}><Text style={styles.headerTitle}>Configurações</Text></View>
        <View style={styles.content}>
            <SectionCard title="Informações do Perfil" subtitle="Gira as suas informações pessoais e dados de contacto.">
                <InfoRow label="Nome Completo" value={userData?.name} onChangeText={(text) => setUserData({...userData, name: text})} editable={isEditing} />
                <InfoRow label="Telefone" value={userData?.phone} onChangeText={(text) => setUserData({...userData, phone: text})} editable={isEditing} />
                <InfoRow label="Email" value={userData?.email} editable={false} />
                <InfoRow label="Biografia" value={userData?.bio} onChangeText={(text) => setUserData({...userData, bio: text})} editable={isEditing} />
                
                {isEditing ? (
                    <View style={styles.editButtonsContainer}>
                        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSaveChanges}><Text style={styles.actionButtonText}>Salvar Alterações</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancelEdit}><Text style={styles.actionButtonText}>Cancelar</Text></TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => setIsEditing(true)}><Text style={styles.actionButtonText}>Editar</Text></TouchableOpacity>
                )}
            </SectionCard>
            <SectionCard title="Notificações" subtitle="Configure como e onde você deseja receber notificações.">
                <ToggleRow label="Novos projetos disponíveis" value={notifications.newProjects} onValueChange={() => setNotifications(prev => ({...prev, newProjects: !prev.newProjects}))} />
                <ToggleRow label="Mensagens recebidas" value={notifications.messages} onValueChange={() => setNotifications(prev => ({...prev, messages: !prev.messages}))} />
                <ToggleRow label="Atualizações de projeto" value={notifications.updates} onValueChange={() => setNotifications(prev => ({...prev, updates: !prev.updates}))} />
            </SectionCard>
            <SectionCard title="Segurança" subtitle="Mantenha a sua conta segura com estas configurações.">
                <ActionRow label="Sair de todos os dispositivos" description="Desconecta a sua conta de todos os outros locais." buttonText="Desconectar" onPress={() => Alert.alert("Ação", "Desconectado de outros dispositivos.")} />
                <ActionRow label="Autenticação de dois fatores" description="Adicione uma camada extra de segurança à sua conta." buttonText="Ativar 2FA" onPress={() => Alert.alert("Ação", "Configurar 2FA.")} />
                <ActionRow label="Histórico de login" description="Veja os acessos recentes à sua conta." buttonText="Ver Histórico" onPress={() => Alert.alert("Ação", "Mostrar histórico.")} />
            </SectionCard>
            <SectionCard title="Zona de Perigo" subtitle="">
                <ActionRow label="Desativar conta permanentemente" description="A sua conta e todos os seus dados serão excluídos." buttonText="Excluir, Conta" onPress={() => setDeleteModalVisible(true)} danger />
            </SectionCard>
        </View>
      </ScrollView>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Excluir, {userData?.name.split(' ')[0]}</Text>
                <Text style={styles.modalWarning}>Atenção! Essa medida é irreversível.</Text>
                <Text style={styles.modalDescription}>
                    Ao excluir sua conta, você perde acesso total ao seu histórico. Delete apenas se tiver 100% de certeza que não precisará dos dados novamente.
                </Text>
                <Text style={styles.modalInputLabel}>DIGITE "EXCLUIR" ABAIXO PARA CONTINUAR:</Text>
                <TextInput
                    style={styles.modalInput}
                    value={deleteConfirmText}
                    onChangeText={setDeleteConfirmText}
                />
                <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={() => { setDeleteModalVisible(false); setDeleteConfirmText(''); }}>
                        <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.modalButton, styles.modalDeleteButton, deleteConfirmText !== 'EXCLUIR,' && styles.modalButtonDisabled]} 
                        onPress={handleDeleteAccount}
                        disabled={deleteConfirmText !== 'EXCLUIR'}
                    >
                        <Text style={styles.modalDeleteButtonText}>Sim, desejo excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { paddingTop: 50, paddingBottom: 20, backgroundColor: '#FFFFFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
    content: { padding: 20 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 20 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    cardSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 15 },
    infoRow: { marginBottom: 15 },
    infoLabel: { fontSize: 14, color: '#374151', marginBottom: 5 },
    infoInput: { backgroundColor: '#F9FAFB', height: 45, borderRadius: 8, paddingHorizontal: 10, fontSize: 16, borderWidth: 1, borderColor: '#D1D5DB' },
    inputDisabled: { backgroundColor: '#E5E7EB', color: '#6B7280' },
    editButtonsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    settingLabel: { fontSize: 16, color: '#374151' },
    settingDescription: { fontSize: 12, color: '#6B7280', paddingTop: 2 },
    actionButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#4F46E5', borderWidth: 1, borderColor: '#D1D5DB' },
    actionButtonText: { color: '#ffffff', fontWeight: '600' },
    editButton: { alignSelf: 'flex-end', marginTop: 10, backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
    saveButton: { backgroundColor: '#10B981', borderColor: '#10B981', marginRight: 10 },
    cancelButton: { backgroundColor: '#6B7280', borderColor: '#6B7280' },
    dangerButton: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
    dangerButtonText: { color: '#EF4444' },
    // --- Estilos do Modal de Exclusão ---
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalWarning: {
        color: '#EF4444',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
        lineHeight: 20,
    },
    modalInputLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginLeft: 10,
    },
    modalCancelButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    modalCancelButtonText: {
        color: '#374151',
        fontWeight: '600',
    },
    modalDeleteButton: {
        backgroundColor: '#EF4444',
    },
    modalDeleteButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    modalButtonDisabled: {
        backgroundColor: '#F9A8A8', // Cor do botão desativado
    },
});
