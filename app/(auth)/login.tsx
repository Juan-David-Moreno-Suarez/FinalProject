import InfoModal from '@/components/InfoModal'
import { supabase } from '@/utils/supabase'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Alert, Animated, Easing, Keyboard, Pressable, StyleSheet, Switch, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'

function AnimatedSwitch() {
  const [selected, setSelected] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const dim = useWindowDimensions()

  const toggleOption = (index: any) => {
    Animated.timing(translateX, {
      toValue: index,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    setSelected(index);
  };
  const switchWidth = dim.width*0.9;
  const ballWidth = switchWidth/2;

  return (
    <View style={styles.bContainer}>
      <View style={[styles.switchBase, { width: switchWidth }]}>

        {/* Opción izquierda */}
        <TouchableOpacity style={styles.option} onPress={() => toggleOption(0)}>
          <Feather name="user" size={22} color={selected== 0? 'black' : '#00000055'} />
          <Text style={selected === 0 ? styles.labelActive : styles.labelInactive}>Cliente</Text>
        </TouchableOpacity>

        {/* Opción derecha */}
        <TouchableOpacity style={styles.option} onPress={() => toggleOption(1)}>
          <MaterialIcons name="work" size={22} color={selected== 1? 'black' : '#00000055'} />
          <Text style={selected === 1 ? styles.labelActive : styles.labelInactive}>Empleado</Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.ball,
            {
              width: ballWidth,
              transform: [{
                translateX: translateX.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, switchWidth - ballWidth],
                })
              }],
            backgroundColor: selected == 0? '#9ec7f0ff' : '#eebbacff',
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [visible, setVisible] = useState(true)
  const goToLog = async() => {
    const {error: loginError} = await supabase.auth.signInWithPassword({email: email, password: password})
    if (!loginError){
      router.navigate('/(main)/home')
    } else {
      Keyboard.dismiss()
      Alert.alert("Algo salió mal","Revisa tus credenciales")
      
    }
  }

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

  return (
    <LinearGradient
      colors={['#8fc3ecff', '#cce5f8ff', '#ffffffff']}
      style={[StyleSheet.absoluteFill, styles.screen]} >
      <InfoModal visible={visible} action={() => setVisible(false)} />
      <Text style={styles.title} >Yummi</Text>
      <Text style={styles.text} >Selecciona tu rol</Text>
      <AnimatedSwitch/>
      <View style={styles.container}>
        <Text style={[styles.text, { alignSelf: 'flex-start' }]}>Correo electrónico</Text>
        {field(email, setEmail, "tu@email.com")}
        <Text style={[styles.text, { alignSelf: 'flex-start' }]}>Contraseña</Text>
        {field(password, setPassword, "Abc-123", true)}
        
        <Pressable
          style={({ pressed }) => [styles.pressable, pressed && { transform: [{ scale: 0.9 }] }]}
          onPress={() => goToLog()}
        >
          <Text style={styles.pText} >Iniciar sesión</Text>
        </Pressable>
      </View>
      <Text style={styles.subtext}>o</Text>
      <View style={styles.rowView}>
        <Text>Nuevo en Yummi?</Text>
        <TouchableOpacity onPress={() => router.navigate('/(auth)/register')}>
          <Text style={[styles.text, { color: '#8ca9d3ff' }]}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 15
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  field: {
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#b7d3ebff',
    margin: 3,
    width: '100%',
    backgroundColor: '#f0f5f5ff'
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    margin: 30,
    width: '90%',
    backgroundColor: '#233253ff',
    borderRadius: 25,
    borderWidth: 1,
    elevation: 5
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    margin: 20
  },
  text: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    margin: 10
  },
  subtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    margin: 5,
    maxWidth: '70%',
    textAlign: 'center'
  },
  pText: {
    fontSize: 20,
    fontFamily: 'BricolageGrotesque-SemiBold',
    color: 'white'
  },
  bContainer: {
    margin: 15,
    alignItems: 'center',
  },
  switchBase: {
    flexDirection: 'row',
    backgroundColor: '#e1e6eb77',
    borderRadius: 20,
    position: 'relative',
    height: 50,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    height: 50,
    flexDirection: 'row'
  },
  labelActive: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'BricolageGrotesque-SemiBold',
    margin: 5
  },
  labelInactive: {
    color: '#00000055',
    fontSize: 14,
    fontFamily: 'BricolageGrotesque-Regular',
    margin: 5
  },
  ball: {
    position: 'absolute',
    top: 0,
    left: 1,
    height: 50,
    borderRadius: 20,
    zIndex: 1,
  }
})