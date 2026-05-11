import {View, Text, Modal, TouchableOpacity} from 'react-native';
import styles from '../styles/StatusModal.styles';

export const StatusModal = ({visible, onRetry, onLater}) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>
                        Nao foi possível conectar ao Broker HiveMQ. 
                        Verifique sua conexão e tente novamente.
                    </Text>

                    <TouchableOpacity style={styles.btnRetry} onPress={onRetry}>
                        <Text style={styles.btnText}>Tentar Novamente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnLater} onPress={onLater}>
                        <Text style={styles.btnText}>Tentar Mais Tarde</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}