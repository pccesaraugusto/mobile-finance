import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createConta } from '../src/services/api';

export default function NovaConta() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [pago, setPago] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!descricao || !valor || !vencimento) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setSaving(true);
    try {
      await createConta({
        descricao,
        valor: parseFloat(valor),
        vencimento,
        pago,
      });
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar a conta.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Conta</Text>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Conta de Luz"
      />

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Vencimento (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={vencimento}
        onChangeText={setVencimento}
        placeholder="2023-12-31"
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Já foi pago?</Text>
        <Switch value={pago} onValueChange={setPago} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Salvar Conta'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  label: { fontSize: 16, color: '#666', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});