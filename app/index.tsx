import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function index() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.screen]} >
      <Text>Select your language</Text>
      <Text style={styles.text} >Welcome</Text>
      <View style={{ height: 20 }} />
      <Link href={'/(auth)/login'} asChild >
        <TouchableOpacity style={styles.touchable} >
          <Text style={styles.touchableText} >Start</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black'
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 5,
    width: '50%'
  },
  touchableText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'blue'
  }
})