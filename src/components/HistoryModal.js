import { Text, View, TouchableOpacity, FlatList, Modal, PanResponder, Animated } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRef, useEffect } from 'react';
import styles from '../styles/HistoryModal.styles';

export const HistoryModal = ({ visible, onClose, history = [] }) => {
    //translateY é a posição vertical do sheet, começa fora da tela (800) e é animada para 0 quando o modal abre
    const translateY = useRef(new Animated.Value(800)).current;

    const panResponder = useRef(PanResponder.create({
        //retorna true para dizer ao pan que ele ira monitorar o gesto
        onStartShouldSetPanResponder: () => true,
        // enquanto o dedo está se movendo, atualiza a posição do sheet.
        onPanResponderMove: (e, gesture) => {
            if (gesture.dy > 0) {
                translateY.setValue(gesture.dy);
            }
        },
        //quando o dedo solta, decide o que fazer:
        //(o primeiro parametro nao é usado pois nao tem o que ser feito com ele)
        onPanResponderRelease: (e, gesture) => {
            if (gesture.dy > 100) {
                //anima o sheet para baixo e depois chama onClose para fechar o modal
                Animated.timing(translateY, {
                    toValue: 800,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => onClose());
            } else {
                //anima o sheet de volta para a posição original
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        },
    })).current;

    useEffect(() => {
        if (visible) {
            translateY.setValue(800);
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const renderItem = ({ item, index }) => {
        const timestamp = new Date(item.timestamp);

        return (
            <View style={styles.card}>
                <View style={styles.row}>
                    <Icon name="clock-outline" size={16} color="#888" />
                    <Text style={styles.timestamp}>
                        {timestamp.toLocaleString('pt-BR')}
                    </Text>
                    {index === 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Mais recente</Text>
                        </View>
                    )}
                </View>

                <View style={styles.row}>
                    <Icon name="thermometer" size={16} color="#FF6B6B" />
                    <Text style={styles.valueTemp}>Temperatura: {item.temp}°C</Text>
                </View>

                <View style={styles.row}>
                    <Icon name="water-percent" size={16} color="#4ECDC4" />
                    <Text style={styles.valueHum}>Umidade: {item.hum}%</Text>
                </View>

                <View style={styles.row}>
                    <Icon
                        name={item.light === '1' ? 'lightbulb-on' : 'lightbulb-off'}
                        size={16}
                        color={item.light === '1' ? '#FFD93D' : '#888'}
                    />
                    <Text style={item.light === '1' ? styles.valueLightOn : styles.valueLightOff}>
                        Luz: {item.light === '1' ? 'Ligada' : 'Desligada'}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent={true}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.overlayClose} onPress={onClose} activeOpacity={1} />
                <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
                    <View {...panResponder.panHandlers}>
                        <View style={styles.handle} />
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.headerText}>
                            Histórico{history.length > 0 ? ` (${history.length})` : ''}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {history.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum dado disponível.</Text>
                    ) : (
                        <FlatList
                            data={history}
                            extraData={history}
                            keyExtractor={(item) => item.timestamp}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                            style={styles.list}
                        />
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};