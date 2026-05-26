import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/HistoryButton.styles';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const HistoryButton = ({ onPress }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.txtButton}>
                    Ver Histórico
                </Text>
                <Icon name="history" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    )
}