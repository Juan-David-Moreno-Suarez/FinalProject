import { View, Text, StyleSheet, FlatList, Pressable, Animated, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { TextInput } from 'react-native'

// 👇 importa tu chat (está en el mismo folder /app/(main)/)
import WaitiaChat from './chat'

export default function home() {

  const category = ["All", "Specials", "Salads", "Bowls", "Drinks"]
  const [selCat, setSelCat] = useState("All")
  const specials = ["Cuaso", "Perro insano", "Frisnack", "Salchipapa", "Mazorcaita"]
  const salads = ["Cesaaaaar", "Emsalada rusa"]
  const bowls = ["Rock stall"]
  const drinks = ["Limonadita", "Tecito", "Juguito"]
  const shownCat = (cat: string) => {
    switch (cat) {
      case "All": return [...specials, ...salads, ...bowls, ...drinks]
      case "Specials": return specials
      case "Salads": return salads
      case "Bowls": return bowls
      case "Drinks": return drinks
      default: return []
    }
  }

  const BUTTON_HEIGHT = 75; // igual que estilos.catButton.height
  const ballPosition = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const index = category.indexOf(selCat)
    Animated.timing(ballPosition, {
      toValue: index * BUTTON_HEIGHT,
      duration: 230,
      useNativeDriver: false,
    }).start()
  }, [selCat])

  function OptionCard({ name }: any) {
    const [open, setOpen] = useState(false)
    return (
      <Pressable onPress={() => setOpen(!open)}
        style={styles.cardContainer}>
        <Text style={[styles.text, { fontSize: 16 }]} >{name}</Text>
        <Text style={styles.description}>Plato insano poderoso a lo Hannibal </Text>
        {open && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#e7f4ff55', borderRadius: 20, width: 100, padding: 2, margin: 10
          }}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color="#ffd446ff" />
            <Text style={[styles.text, { fontSize: 12 }]}>250 kcal</Text>
          </View>
        )}
        <Text style={[styles.text, { fontSize: 14 }]}>$30.000</Text>
        {open && (
          <Pressable style={({ pressed }) => [{
            position: 'absolute', left: 220, bottom: 20,
            backgroundColor: '#182e69ff', height: 50, aspectRatio: 1,
            alignItems: 'center', justifyContent: 'center', borderRadius: 22,
          },
          pressed && { transform: [{ scale: 0.85 }] }
          ]}>
            <Text style={[styles.sCategory, { fontSize: 28 }]}>+</Text>
          </Pressable>
        )}
      </Pressable>
    )
  }

  // ======= Chat flotante =======
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <LinearGradient
      colors={['#b6d8f3ff', '#d8e9f7ff', '#ffffffff']}
      style={[StyleSheet.absoluteFill, styles.screen]}
    >
      <View style={styles.topContainer}>
        <Text style={styles.title} >Yummi</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="black" />
          <TextInput style={{ marginLeft: 5 }} placeholder='Search smoothies, juices, bowls' />
        </View>
        <View style={styles.filter}>
          <Ionicons name="filter" size={30} color="black" />
        </View>
      </View>

      <Text style={[styles.text, { marginTop: 15 }]}>TODAY'S SPECIAL</Text>
      <View style={[styles.cardContainer, { width: '90%', marginBottom: 10 }]}>
        <Text style={[styles.text, { fontSize: 22 }]}>Platazo</Text>
        <Text style={styles.description}>Descripción del platazo</Text>
        <Text style={[styles.text, { fontSize: 16 }]}>5000 kcal - $100.000</Text>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.catContainer}>
          <Animated.View
            style={[
              styles.ball,
              { top: ballPosition }
            ]}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={category}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable style={styles.catButton}
                onPress={() => setSelCat(item)}>
                <Text numberOfLines={1}
                  style={[selCat == item ? styles.sCategory : styles.category, { transform: [{ rotate: '-90deg' }] }]} >{item}</Text>
              </Pressable>
            )}
          />
        </View>
        <View style={styles.menuContainer}>
          <FlatList
            data={shownCat(selCat)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View>
                <View style={{ height: 10 }} />
                <OptionCard name={item} />
              </View>
            )}
          />
        </View>
      </View>

      <View style={[styles.cardContainer, { width: '90%', margin: 10, backgroundColor: 'white', elevation: 3 }]}>
        <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}>
          <View style={{ backgroundColor: '#ffc0c0ff', borderRadius: 100, padding: 8, marginRight: 15 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 100, padding: 10 }}>
              <MaterialCommunityIcons name="lightning-bolt" size={30} color="#ffd446ff" />
            </View>
          </View>
          <View>
            <Text style={[styles.text, { fontSize: 16 }]}>Selection: 0 kcal</Text>
            <Text style={styles.description}>Goal: 2000 kcal</Text>
          </View>
        </View>
      </View>

      {/* ===== FAB del chat flotante ===== */}
      <Pressable
        onPress={() => setChatOpen(true)}
        style={{
          position: 'absolute',
          right: 18,
          bottom: 90,             // deja aire sobre la barra de tabs
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#FDA597',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      </Pressable>

      {/* ===== Modal con el chat ===== */}
      <Modal visible={chatOpen} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setChatOpen(false)}>
        <View style={{ flex: 1, backgroundColor: '#F5FAF9' }}>
          {/* Botón cerrar */}
          <Pressable
            onPress={() => setChatOpen(false)}
            style={{
              position: 'absolute',
              top: 36,
              right: 16,
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.08)',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons name="close" size={22} color="#181F39" />
          </Pressable>

          {/* Tu pantalla de chat dentro del modal */}
          <WaitiaChat />
        </View>
      </Modal>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  topContainer: {
    width: '80%',
    flexDirection: 'row'
  },
  searchContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  searchBar: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#d7ebf8ff',
    borderRadius: 18,
    marginRight: 10
  },
  filter: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#ffc0c0ff',
    height: '100%',
    aspectRatio: 1
  },
  bodyContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '46.5%'
  },
  catContainer: {
    alignItems: 'center',
    height: '100%',
    width: '25%'
  },
  cardContainer: {
    padding: 10,
    backgroundColor: '#acd1f0ff',
    borderRadius: 25,
    width: 400
  },
  menuContainer: {
    alignItems: 'center',
    height: '100%'
  },
  title: {
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
    marginTop: 30
  },
  sCategory: {
    fontFamily: 'BricolageGrotesque-SemiBold',
    fontSize: 14,
    color: 'white'
  },
  category: {
    fontFamily: 'BricolageGrotesque-Regular',
    fontSize: 14,
    color: '#00000055',
    width: 100,
    textAlign: 'center'
  },
  catButton: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: 100
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    margin: 5
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13
  },
  ball: {
    position: 'absolute',
    left: 34,
    width: 35,
    height: 75,
    borderRadius: 20,
    backgroundColor: '#ffc0c0ff'
  }
})
