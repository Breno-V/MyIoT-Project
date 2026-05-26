import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end', 
    },
    sheet: {
        backgroundColor: '#1E1E1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        gap: 16,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#444',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 8,
    },
    list: {
        flex: 1,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        gap: 18,
    },
    timestamp: {
        color: '#888',
        fontSize: 13,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    valueTemp: {
        color: '#FF6B6B',
        fontSize: 15,
    },
    valueHum: {
        color: '#4ECDC4',
        fontSize: 15,
    },
    valueLightOn: {
        color: '#FFD93D',
        fontSize: 15,
    },
    valueLightOff: {
        color: '#888',
        fontSize: 15,
    },
});

export default styles;