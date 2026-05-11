import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Gauges } from './src/components/Gauges';
import { LightControl } from './src/components/LightControl';
import { StatusModal } from './src/components/StatusModal';
import mqttService from './src/services/mqttService';

const mqtt = new mqttService();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const mqttConfig = {
    host: process.env.MQTT_HOST,
    port: parseInt(process.env.MQTT_PORT),
    path: process.env.MQTT_PATH,
    user: process.env.MQTT_USER,
    pass: process.env.MQTT_PASS,
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
        if (topic === 'casa/temp') setTemp(parseFloat(message));
        if (topic === 'casa/hum') setHum(parseFloat(message));
        if (topic === 'casa/luz') setIsLightOn(message === '1');
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
    mqtt.publish('casa/luz', newState);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}> Smart Home IoT</Text>

      <LightControl
        isOn={isLightOn}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
