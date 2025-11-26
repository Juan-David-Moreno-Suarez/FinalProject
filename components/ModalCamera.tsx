import React, { useState } from 'react';
import { useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import QrScan from './qrScan';

export default function ModalCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);

  const isPermissionGranted = Boolean(permission?.granted);

  const handleScanPress = () => {
    if (isPermissionGranted) {
      setShowScanner(true); 
    }
  };

  if (showScanner) {
    return <QrScan/>;
  }

  return (
    <View style={styleSheet.container}>
      <StatusBar style="auto" />

      <Text style={styleSheet.mainText}>Escáner QR</Text>

      <Pressable style={[styleSheet.mainBtn, styleSheet.btnGreen]} onPress={requestPermission}>
        <Text>Permisos</Text>
      </Pressable>

      <Pressable
        onPress={handleScanPress}
        style={[styleSheet.mainBtn, styleSheet.btnYellow, { opacity: isPermissionGranted ? 1 : 0.5 }]}
        disabled={!isPermissionGranted}
      >
        <Text>Escanear código</Text>
      </Pressable>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 20,
  },
  mainBtn: {
    width: 200,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  btnGreen: {
    backgroundColor: "#a7edf7ff",
  },
  btnYellow: {
    backgroundColor: '#f5bebeff',
  },
  mainText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
