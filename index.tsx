import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Conta, deleteConta, getContas } from '../src/services/api';


export default function ListaContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  const carregarContas = async () => {
    setLoading(true);
    try {
      const dados = await getContas();
      setContas(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as contas.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarContas();
    }, [])
  );

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await deleteConta(id);
      carregarContas();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar a conta.');
    }
  };

  const renderItem = ({ item }: { item: Conta }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.descricao}>{item.descricao}</Text>
        <Text style={styles.data}>Venc: {item.vencimento}</Text>
        <Text style={[styles.valor, { color: item.pago ? 'green' : 'red' }]}>
          R$ {Number(item.valor).toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contas}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregarContas} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma conta encontrada.</Text>}
      />

      <Link href="/nova-conta" asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  descricao: { fontSize: 18, fontWeight: '600' },
  data: { color: '#666', marginTop: 4 },
  valor: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  deleteButton: { padding: 10 },
  deleteText: { color: 'red', fontWeight: 'bold', fontSize: 18 },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 30, marginTop: -2 },
});