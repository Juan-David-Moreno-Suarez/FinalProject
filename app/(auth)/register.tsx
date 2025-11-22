import { Feather, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'

function AnimatedSwitch({ selected, setSelected }: any) {

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
  const switchWidth = dim.width * 0.9;
  const ballWidth = switchWidth / 2;

  return (
    <View style={styles.bContainer}>
      <View style={[styles.switchBase, { width: switchWidth }]}>

        <TouchableOpacity style={styles.option} onPress={() => {
          toggleOption(0)
        }}>
          <Feather name="user" size={22} color={selected == 0 ? 'black' : '#00000055'} />
          <Text style={selected === 0 ? styles.labelActive : styles.labelInactive}>Client</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => {
          toggleOption(1)
        }}>
          <Ionicons name="storefront-outline" size={22} color={selected == 1 ? 'black' : '#00000055'} />
          <Text style={selected === 1 ? styles.labelActive : styles.labelInactive}>Staff</Text>
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
              backgroundColor: selected == 0 ? '#c1d9f3ff' : '#f3cec2ff',
            },
          ]}
        />
      </View>
    </View>
  );
}

function Field({ text, change, info, secure = false }: any) {
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

export default function register() {

  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cPassword, setCPassword] = useState("")
  const router = useRouter()
  const [selected, setSelected] = useState(0);

  return (
    <LinearGradient
      colors={['#f3c3c3ff', '#f0d8d8ff', '#ffffffff']}
      style={[StyleSheet.absoluteFill, styles.screen]} >
      <Text style={styles.title} >Yummi</Text>
      <Text style={styles.text} >Select your role</Text>
      <AnimatedSwitch selected={selected} setSelected={setSelected} />
      <View style={styles.container}>
        {selected == 1 &&
          <View style={[styles.screen, { width: '100%' }]}>
            <Text style={[styles.text, { alignSelf: 'flex-start' }]}>Employer's ID</Text>
            <Field text={id} change={setId} info={'Write the ID'} />
          </View>
        }
        {selected == 0 &&
          <View style={[styles.screen, { width: '100%' }]}>
            <Text style={[styles.text, { alignSelf: 'flex-start' }]}>Name</Text>
            <Field text={name} change={setName} info={'Write your full name'} />
          </View>
        }
        <Text style={[styles.text, { alignSelf: 'flex-start' }]}>Email</Text>
        <Field text={email} change={setEmail} info={"your@email.com"} />
        <Text style={[styles.text, { alignSelf: 'flex-start' }]}>Password</Text>
        <Field text={password} change={setPassword} info={"Abc-123"} secure={true} />
        <Text style={[styles.text, { alignSelf: 'flex-start' }]}>Confirm password</Text>
        <Field text={cPassword} change={setCPassword} info={"Abc-123"} secure={true} />
        <View style={styles.rowView}>
        </View>
        <Pressable
          style={({ pressed }) => [styles.pressable, pressed && { transform: [{ scale: 0.9 }] }]}
          onPress={() => router.navigate('/(main)/home')}
        >
          <Text style={styles.pText} >Sign up</Text>
        </Pressable>
      </View>
      <Text style={styles.subtext}>By continuing, you accept our Terms & Conditions</Text>
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