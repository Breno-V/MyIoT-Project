import { Text, View, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import styles from '../styles/HistoryModal.styles';

export const HistoryModal = ({ visible, onClose, temp, hum, light, timestamp }) => {
    const hasData = temp || hum || light;

    return (
        <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent={true}>
            <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
                <TouchableOpacity style={styles.sheet} activeOpacity={1}>

                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <Text style={styles.headerText}>Leitura Atual</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {!hasData ? (
                        <Text style={styles.emptyText}>Nenhum dado disponível.</Text>
                    ) : (
                        <View style={styles.card}>
                            {timestamp && (
                                <View style={styles.row}>
                                    <Icon name="clock-outline" size={18} color="#888" />
                                    <Text style={styles.timestamp}>
                                        {timestamp.toLocaleString('pt-BR')}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.row}>
                                <Icon name="thermometer" size={18} color="#FF6B6B" />
                                <Text style={styles.valueTemp}>Temperatura: {temp}°C</Text>
                            </View>
                            <View style={styles.row}>
                                <Icon name="water-percent" size={18} color="#4ECDC4" />
                                <Text style={styles.valueHum}>Umidade: {hum}%</Text>
                            </View>
                            <View style={styles.row}>
                                <Icon
                                    name={light === '1' ? 'lightbulb-on' : 'lightbulb-off'}
                                    size={18}
                                    color={light === '1' ? '#FFD93D' : '#888'}
                                />
                                <Text style={light === '1' ? styles.valueLightOn : styles.valueLightOff}>
                                    Luz: {light === '1' ? 'Ligada' : 'Desligada'}
                                </Text>
                            </View>
                        </View>
                    )}

                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};