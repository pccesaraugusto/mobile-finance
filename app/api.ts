import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Pega a URL configurada no app.json ou usa localhost como fallback
const getApiUrl = () => {
  if (Platform.OS === 'web') return 'http://localhost:3000';
  return Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';
};

const API_URL = getApiUrl();

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export interface Conta {
  id?: number;
  descricao: string;
  valor: number;
  vencimento: string; // Formato YYYY-MM-DD
  pago: boolean;
}

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Falha na autenticação');
  return await response.json();
};

export const getContas = async (): Promise<Conta[]> => {
  try {
    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}/contas`, { headers });
    if (!response.ok) throw new Error('Falha ao buscar contas');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createConta = async (conta: Conta): Promise<Conta> => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}/contas`, {
    method: 'POST',
    headers,
    body: JSON.stringify(conta),
  });
  if (!response.ok) throw new Error('Falha ao criar conta');
  return await response.json();
};

export const deleteConta = async (id: number): Promise<void> => {
  const headers: HeadersInit = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}/contas/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Falha ao deletar conta');
};