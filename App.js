import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
//useRef para armazenar os últimos valores recebidos e enviados
//useState para controlar o estado da conexão, dos dados e dos modais
//useEffect para carregar os dados salvos e iniciar a conexão MQTT ao montar o componente
import { Gauges } from './src/components/Gauges';
import { LightControl } from './src/components/LightControl';
import { StatusModal } from './src/components/StatusModal';
import { HistoryButton } from './src/components/HistoryButton';
import { HistoryModal } from './src/components/HistoryModal';
import mqttService from './src/services/mqttService';
import styles from './src/styles/App.styles';

const mqtt = new mqttService();
let currentHistory = [];

export default function App() {
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

  const mqttConfig = {
    host: process.env.EXPO_PUBLIC_MQTT_HOST,
    port: parseInt(process.env.EXPO_PUBLIC_MQTT_PORT),
    path: process.env.EXPO_PUBLIC_MQTT_PATH,
    user: process.env.EXPO_PUBLIC_MQTT_USERNAME,
    pass: process.env.EXPO_PUBLIC_MQTT_PASS,
    clientId: 'RN_App_' + Math.random(),
  };

  useEffect(() => {
    loadData();
    startConnection();
  }, []);

  const loadData = async () => {
    try {
      const savedTemp = await AsyncStorage.getItem('temp');
      const savedHum = await AsyncStorage.getItem('hum');
      const savedLight = await AsyncStorage.getItem('light');
      const savedTimestamp = await AsyncStorage.getItem('timestamp');
      const savedHistory = await AsyncStorage.getItem('history');

      if (savedHistory) {
        currentHistory = JSON.parse(savedHistory);
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
    currentHistory = [newItem, ...currentHistory];
    setHistory([...currentHistory]);
    await AsyncStorage.setItem('history', JSON.stringify(currentHistory));
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
        }

        if (topic === 'casa/hum') {
          const value = parseFloat(message);
          lastHumRef.current = value;
          setHum(value);
          setLastTimestamp(now);
        }

        if (topic === 'casa/luz') {
          lastLightRef.current = message;
          setIsLightOn(message === '1');
          setLastTimestamp(now);
        }

        if (lastTempRef.current !== null || lastHumRef.current !== null || lastLightRef.current !== null) {
          saveHistory({
            temp: lastTempRef.current,
            hum: lastHumRef.current,
            light: lastLightRef.current,
            timestamp: now.toISOString(),
          });
        }
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

      <HistoryButton onPress={() => setShowHistory(true)} />

      <HistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
      />

    </View>
  );
}