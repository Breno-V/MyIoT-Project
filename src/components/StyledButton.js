import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/StyledButton.styles';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const StyledButton = ({ onPress, nameIcon, text }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.txtButton}>
                    {text}
                </Text>
                <Icon name={nameIcon} size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    )
}