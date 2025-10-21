import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'

export default function login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const field = (text: string, change: any, info: string, secure: boolean = false) => {
    return (
      <View style={styles.field} >
        <TextInput
          value={text}
          onChangeText={change}
          placeholder={info}
          secureTextEntry={secure}
        />
      </View>
    )
  }

  const button = (text: string, pressed: any, color: string) => {
    return (
      <Pressable
        style={({pressed}) => [styles.pressable, {backgroundColor: color}, pressed && {transform: [{scale: 0.9}]}]}
        onPress={pressed}
      >
        <Text style = {styles.pText} >{text}</Text>
      </Pressable>
    )
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.screen]} >
      <Text style = {styles.pText} >login</Text>
      {field(email, setEmail, "Write your email")}
      {field(password, setPassword, "Write your password", true)}
      {button("Log in", () => router.navigate('/(main)/home'), "#7dcfa1ff")}
      <Text>or</Text>
      {button("Register", () => router.navigate('/(auth)/register'), "#df8b88ff")}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  field: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 1,
    margin: 2,
    padding: 5,
    width: 300,
    backgroundColor: 'transparent'
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    margin: 30,
    width: 300,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 8
  },
  pText: {
    fontSize: 30,
    fontWeight: 'semibold'
  }
})