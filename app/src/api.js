import * as SecureStore from 'expo-secure-store';
import { API_URL } from './config';

let token = null;
let onUnauthorized = () => {};

export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };
export const setToken = async (t) => {
  token = t;
  if (t) await SecureStore.setItemAsync('token', t);
  else await SecureStore.deleteItemAsync('token');
};
export const loadToken = async () => {
  token = await SecureStore.getItemAsync('token');
  return token;
};

export async function api(path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const [p, q] = path.split('?');
  let res;
  try {
    res = await fetch(`${API_URL}/${p}.php${q ? '?' + q : ''}`, {
      method: body ? 'POST' : 'GET',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error('NETWORK');
  }
  let data = {};
  try { data = await res.json(); } catch (e) {}
  if (res.status === 401 && token) onUnauthorized();
  if (!res.ok) throw new Error(data.error || 'GENERIC');
  return data;
}
