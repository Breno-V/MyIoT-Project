import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },

    tituloGeral: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#f8fafc', 
        marginBottom: 20 
    },

    card: {
        backgroundColor: '#1e293b', 
        padding: 16, 
        borderRadius: 12, 
        marginBottom: 20 
    },

    cardHeader: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },

    header: {
        display: 'flex',
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
    },

    tituloSecao: { 
        fontSize: 18,
        fontWeight: '600',
        color: '#f1f5f9',
        marginBottom: 15
    },

    txtSemDados: { 
        color: '#94a3b8',
        textAlign: 'center',
        padding: 10
    },

    containerLegenda: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 20,
        marginTop: 10,
        width: '100%',
    },

    itemLegenda: {
        flexDirection: 'row',
        alignItems: 'center',  
        gap: 8,                  
    },

    indicadorCor: {
        width: 14,
        height: 14,
        borderRadius: 4,
    },

    txtLegenda: {
        fontWeight: '500',
    }
});

export default styles;