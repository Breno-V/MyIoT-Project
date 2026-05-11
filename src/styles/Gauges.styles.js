import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    gaugeBox: {
        backgroundColor: '#1e1e1e',
        padding: 15,
        alignItems: 'center',
        with: '48%',
        borderRadius: 20,
    },
    label: {
        color: '#AAA',
        fontSize: 14,
        marginTop: 10,
    },
});

export default styles;