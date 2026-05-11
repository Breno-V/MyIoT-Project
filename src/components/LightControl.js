import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from 'react-native-vector-icons/MaterialCommunityIcons';
import stylees from '../styles/LightControl.styles';

export const LightControl = ({ isLightOn, onToggle }) => {
    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={onToggle}>
                <Icon
                    name={isLightOn ? 'lightbulb-on' : 'lightbulb-outline'}
                    size={100}
                    color={isLightOn ? '#F1C40F' : '#555'}
                />
            </TouchableOpacity>
            <Text style={styles.label}>
                {isLightOn ? 'Luz Ligada' : 'Luz Desligada'}
            </Text>
        </View>
    )
}
