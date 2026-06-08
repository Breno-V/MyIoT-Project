import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
//useRef para armazenar os últimos valores recebidos e enviados
//useState para controlar o estado da conexão, dos dados e dos modais
//useEffect para carregar os dados salvos e iniciar a conexão MQTT ao montar o componente
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Gauges } from '../components/Gauges';
import { LightControl } from '../components/LightControl';
import { StatusModal } from '../components/StatusModal';
import { StyledButton } from '../components/StyledButton';
import { HistoryModal } from '../components/HistoryModal';
import { useNavigation } from '@react-navigation/native';
import mqttService from '../services/mqttService';
import styles from '../styles/HomeScreen.styles';

const mqtt = new mqttService();

export default function HomeScreen({ navigation }) {
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [showError, setShowError] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const lastTempRef = useRef(null);
  const lastHumRef = useRef(null);
  const lastLightRef = useRef(null);
  const lastSentRef = useRef(null);
  const debounceRef = useRef(null); // Para evitar salvar no histórico a cada mensagem, espera 500ms após a última atualização
  const historyRef = useRef([]); // Para manter o histórico atualizado sem depender do estado (que é assíncrono)

  const mqttConfig = {
    host: process.env.EXPO_PUBLIC_MQTT_HOST,
    port: parseInt(process.env.EXPO_PUBLIC_MQTT_PORT),
    path: process.env.EXPO_PUBLIC_MQTT_PATH,
    user: process.env.EXPO_PUBLIC_MQTT_USERNAME,
    pass: process.env.EXPO_PUBLIC_MQTT_PASS,
    clientId: 'RN_App_' + Math.random(),
  };

  useEffect(() => {
    startConnection();
  }, []);

  // Roda toda vez que a tela ganha foco: sincroniza estado com AsyncStorage
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const savedTemp = await AsyncStorage.getItem('temp');
      const savedHum = await AsyncStorage.getItem('hum');
      const savedLight = await AsyncStorage.getItem('light');
      const savedTimestamp = await AsyncStorage.getItem('timestamp');
      const savedHistory = await AsyncStorage.getItem('history');

      if (savedHistory) {
        // Ao carregar o histórico, também atualizamos a referência para manter tudo sincronizado
        const currentHistory = JSON.parse(savedHistory);
        historyRef.current = currentHistory;
        setHistory(currentHistory);
      }
      if (savedTemp) {
        setTemp(parseFloat(savedTemp));
        lastTempRef.current = parseFloat(savedTemp);
      }
      if (savedHum) {
        setHum(parseFloat(savedHum));
        lastHumRef.current = parseFloat(savedHum);
      }
      if (savedLight) {
        setIsLightOn(savedLight === '1');
        lastLightRef.current = savedLight;
      }
      if (savedTimestamp) {
        setLastTimestamp(new Date(savedTimestamp));
      }
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    }
  };

  const saveHistory = async (newItem) => {
    const itemComId = {
      ...newItem,
      // o id gerado é igual a timestamp + um sufixo aleatório, garantindo que mesmo itens com o mesmo timestamp tenham ids únicos
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    historyRef.current = [itemComId, ...historyRef.current];
    setHistory([...historyRef.current]);
    await AsyncStorage.setItem('history', JSON.stringify(historyRef.current));
  };

  const startConnection = () => {
    setShowError(false);

    mqtt.connect(
      mqttConfig,
      (topic, message) => {
        const now = new Date();

        if (topic === 'casa/temp') {
          const value = parseFloat(message);
          lastTempRef.current = value;
          setTemp(value);
          setLastTimestamp(now);
          AsyncStorage.setItem('temp', String(lastTempRef.current)); //adicionado após menção B
          AsyncStorage.setItem('timestamp', now.toISOString()); //adicionado após menção B
        }

        if (topic === 'casa/hum') {
          const value = parseFloat(message);
          lastHumRef.current = value;
          setHum(value);
          setLastTimestamp(now);
          AsyncStorage.setItem('hum', String(lastHumRef.current)); //adicionado após menção B
          AsyncStorage.setItem('timestamp', now.toISOString()); //adicionado após menção B
        }

        if (topic === 'casa/luz') {
          lastLightRef.current = message;
          setIsLightOn(message === '1');
          setLastTimestamp(now);
          AsyncStorage.setItem('light', lastLightRef.current); //adicionado após menção B
          AsyncStorage.setItem('timestamp', now.toISOString()); //adicionado após menção B
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          if (lastTempRef.current !== null || lastHumRef.current !== null || lastLightRef.current !== null) {
            saveHistory({
              temp: lastTempRef.current,
              hum: lastHumRef.current,
              light: lastLightRef.current,
              timestamp: now.toISOString(),
            });
          }
        }, 500);
      },
      () => {
        setIsConnected(true);
        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/hum');
        mqtt.subscribe('casa/luz');
      },
      (err) => {
        setIsConnected(false);
        setShowError(true);
      }
    );
  };

  const toggleLight = () => {
    const newState = isLightOn ? '0' : '1';
    lastSentRef.current = newState;
    mqtt.publish('casa/luz', newState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Home IoT</Text>

      <LightControl
        isLightOn={isLightOn}
        onToggle={toggleLight}
      />

      <Gauges
        temp={temp}
        hum={hum}
      />

      <StatusModal
        visible={showError}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />

      <StyledButton
        onPress={() => setShowHistory(true)}
        nameIcon="history"
        text="Ver Histórico"
      />

      <StyledButton
        onPress={() => navigation.navigate('Dashboard', { history: history })}
        nameIcon="chart-line"
        text="Ver Dashboard"
      />

      <HistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
      />

    </View>
  );
}