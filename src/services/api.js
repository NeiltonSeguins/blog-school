import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Tenta obter o IP da máquina onde o Expo está rodando (para dispositivo físico)
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:3000`;
  }

  // Configuração padrão para Emulador Android e Web
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  
  // iOS Simulator ou Web
  return 'http://localhost:3000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

export default api;
