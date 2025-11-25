import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ModalCamera from './ModalCamera';
import { useRouter } from 'expo-router';

export default function PaymentConfirmation() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      {/* Content */}
      <LinearGradient
        colors={['#E3F2FD', '#FFFFFF']}
        style={styles.contentContainer}
      >
        <Image
          source={require('../assets/images/celebrando.png')}
          style={styles.characterImage}
        />

        <Text style={styles.title}>¡Pago confirmado!</Text>
        <Text style={styles.message}>
          Tu pago se ha efectuado correctamente. 🎉 Si pediste efectivo, espera a tu mesero.
        </Text>

        {/* Botón para abrir modal */}
        <Pressable
          style={styles.button}
          onPress={() => router.navigate('/(main)/form')}
        >
          <Text style={styles.buttonText}>Escanea qr para calificar a tu mesero</Text>
        </Pressable>

        <Image
          source={require('../assets/images/qr.png')}
          style={styles.qrImage}
        />
      </LinearGradient>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <ModalCamera/>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 30,
    left: 10,
    borderRadius: 20,
    backgroundColor: '#e4f6fdff',
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  contentContainer: {
    width: '95%',
    height: '92%',
    marginTop: 5,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    elevation: 5,
  },
  characterImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#58A4B0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  qrImage: {
    width: 120,
    height: 120,
    margin: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#58A4B0',
    borderRadius: 20,
  },
  modalCloseText: {
    color: 'white',
    fontWeight: '600',
  },
});
