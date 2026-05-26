import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Gauges } from './src/components/Gauges';
import { LightControl } from './src/components/LightControl';
import { StatusModal } from './src/components/StatusModal';
import mqttService from './src/services/mqttService';
import styles from './src/styles/App.styles';

const mqtt = new mqttService();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const lastTempRef = useRef(0);
  const lastHumRef = useRef(0);
  const lastLightRef = useRef(null);
  const lastSentRef = useRef(null);
  
  
  const mqttConfig = {
    host: process.env.EXPO_PUBLIC_MQTT_HOST,
    port: parseInt(process.env.EXPO_PUBLIC_MQTT_PORT),
    path: process.env.EXPO_PUBLIC_MQTT_PATH || '',
    user: process.env.EXPO_PUBLIC_MQTT_USERNAME,
    pass: process.env.EXPO_PUBLIC_MQTT_PASS,
    clientId: 'RN_App_' + Math.random(),  
  };

  useEffect(() => {
    startConnection();
  }, []);

  const startConnection = () => {
    setShowError(false);

    mqtt.connect(
      mqttConfig,
      (topic, message) => {
        if (topic === 'casa/temp') {
          lastTempRef.current = parseFloat(message);
          setTemp(parseFloat(message));
        }
          
        if (topic === 'casa/hum') {
          lastHumRef.current = parseFloat(message);
          setHum(parseFloat(message));
        }
        if (topic === 'casa/luz') {
          lastLightRef.current = message;
          setIsLightOn(message === '1');
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
  }

  const toggleLight = () => {
    const newState = isLightOn ? '0' : '1';
    lastSentRef.current = newState;
    mqtt.publish('casa/luz', newState);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}> Smart Home IoT</Text>

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
    </View>
  );
}
