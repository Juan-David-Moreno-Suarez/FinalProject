import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={['#8fc3ecff', '#cce5f8ff', '#ffffffff']}
      style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      <Image source={require('../assets/images/splashIcon.gif')} style={{ width: 200, height: 200 }} />
      <Text>Loading...</Text>
    </LinearGradient>
  )
}