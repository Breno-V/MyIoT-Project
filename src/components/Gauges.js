import { View, Text } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

export const Gauges = ({ temp, hum }) => {
    return (
        <View style={styles.row}>
            <View style={styles.gaugeBox}>
                <CircularProgress
                    value={temp}
                    radius={60}
                    title={'ºC'}
                    titleColor="#FFF"
                    activeStrokeColor="#E74C3C"
                    inactiveStrokeColor="#2C3E50"
                />
                <Text style={styles.label}>Temperatura</Text>
            </View>
            <View style={styles.gaugeBox}>
                <CircularProgress
                    value={hum}
                    radius={60}
                    title={'%'}
                    titleColor="#FFF"
                    activeStrokeColor="#3498DB"
                    inactiveStrokeColor="#2C3E50"
                    textColor="#FFF"
                />
                <Text style={styles.label}>Umidade</Text>
            </View>
        </View>
    )
}