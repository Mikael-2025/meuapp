import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";

// 1. Importe o 'auth' do seu ficheiro de configuração
import { auth } from '../../firebaseConfig'; // Ajuste o caminho se necessário
// Importe a função de login do Firebase
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Função para gerir o Login
  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert("Erro", "Por favor, preencha o email e a senha.");
        return;
    }
    setIsLoading(true);

    try {
        // Tenta fazer o login com o email e senha fornecidos
        await signInWithEmailAndPassword(auth, email, password);
        
        // Se o login for bem-sucedido, o código continua aqui.
        // Por agora, vamos apenas mostrar um alerta de sucesso.
        // No futuro, aqui é onde o utilizador seria redirecionado para o Dashboard.
        // Ex: navigation.replace('Dashboard');
        
        // Não precisamos de desativar o isLoading aqui, porque um 'listener' de autenticação
        // no App.js irá gerir a mudança de tela.

    } catch (error) {
        setIsLoading(false);
        Alert.alert("Erro de Login", "Email ou senha inválidos. Por favor, tente novamente.");
        console.error("Erro no login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
      />

      {/* 3. Botão de Entrar chama a função handleLogin */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
        ) : (
            <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.text}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
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
  signupContainer: {
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
});
