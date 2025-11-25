import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import * as Font from 'expo-font'
import SplashScreen from '@/components/splash-screen'
import { LinearGradient } from 'expo-linear-gradient'

export default function index() {

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    Font.loadAsync({
      'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
      'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
      'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
      'BricolageGrotesque-Regular': require('../assets/fonts/BricolageGrotesque-Regular.ttf'),
      'BricolageGrotesque-SemiBold': require('../assets/fonts/BricolageGrotesque-SemiBold.ttf'),
      'BricolageGrotesque-Bold': require('../assets/fonts/BricolageGrotesque-Bold.ttf')
    }).then(() => setIsLoaded(true))
  }, [])

  if (!isLoaded) {
    return <SplashScreen />
  }

  return (
    <LinearGradient
      colors={['#8fc3ecff', '#cce5f8ff', '#ffffffff']}
      style={[StyleSheet.absoluteFill, styles.screen]} >
      <Text style={styles.title} >Bienvenido a nuestro restaurante!</Text>

      <View style={{ height: 20 }} />
      <Link href={'/(auth)/login'} asChild >
        <TouchableOpacity style={styles.touchable} >
          <Text style={styles.touchableText} >Iniciar
          </Text>
        </TouchableOpacity>
      </Link>
      <View style = {[styles.decoration, {top:-100, right: -100}]}/>
      <View style = {[styles.decoration, {bottom:-80, right: -80}]}/>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: 'black',
    maxWidth: '90%',
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'black'
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderRadius: 25,
    borderWidth: 0.5,
    padding: 8,
    backgroundColor: '#233253ff',
    elevation: 5
  },
  touchableText: {
    fontSize: 20,
    fontFamily: 'BricolageGrotesque-SemiBold',
    color: 'white'
  },
  decoration: {
    width: 300,
    aspectRatio: 1,
    backgroundColor: '#f19a9a20',
    borderRadius: 150,
    position: 'absolute'
  }
})