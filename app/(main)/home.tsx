import { DataContext } from '@/contexts/DataContext'
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import WaitiaChat from './chat'

export default function home() {

  const [selCat, setSelCat] = useState('Todos')
  const category = ['Todos', 'Especiales', 'Ensaladas', 'Combos', 'Bebidas']
  const { getCategoryMenu, getSpecial } = useContext(DataContext)
  const [menu, setMenu] = useState<any[]>([])
  const [special, setSpecial] = useState<any>(null)

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await getCategoryMenu(selCat)
        setMenu(data || [])
      } catch (error) {
        console.error('Error loading menu:', error)
      }
    }
    fetchMenu()
  }, [selCat])

  useEffect(() => {
    async function fetchSpecial() {
      try {
        const spec = await getSpecial()
        setSpecial(spec)
      } catch (error) {
        console.error('Error loading menu:', error)
      }
    }
    fetchSpecial()
  }, [])

  const BUTTON_HEIGHT = 75
  const ballPosition = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const index = category.indexOf(selCat)
    Animated.timing(ballPosition, {
      toValue: index * BUTTON_HEIGHT,
      duration: 230,
      useNativeDriver: false
    }).start()
  }, [selCat])

  function OptionCard({ item }: { item: any }) {
    const [open, setOpen] = useState(false)

    return (
      <Pressable
        onPress={() => setOpen(!open)}
        style={[styles.cardContainer, styles.optionCard]}
      >
        <View style={styles.optionLeft}>
          <View style={styles.thumbPlaceholder} />
        </View>

        <View style={styles.optionMiddle}>
          <Text style={[styles.text, { fontSize: 14 }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          {open && (
            <View style={styles.chipRow}>
              <View style={styles.calChip}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={16}
                  color="#ffd446ff"
                />
                <Text style={[styles.text, { fontSize: 11 }]}>
                  {item.calories} cal
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.optionRight}>
          <Text style={[styles.text, { fontSize: 13 }]}>{`$${item.price}`}</Text>
          {open && (
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && { transform: [{ scale: 0.9 }] }
              ]}
            >
              <Text style={[styles.sCategory, { fontSize: 20 }]}>+</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    )
  }

  function SpecialCard({ item }: { item: any }) {
    const [open, setOpen] = useState(false)

    return (
      <Pressable
        onPress={() => setOpen(!open)}
        style={[styles.cardContainer, styles.specialCard]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.text, { fontSize: 16 }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
            {open && (
              <View style={styles.calChip}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={18}
                  color="#ffd446ff"
                />
                <Text style={[styles.text, { fontSize: 12 }]}>
                  {item.calories} cal
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Text style={[styles.text, { fontSize: 16 }]}>{`$${item.price}`}</Text>

            {open && (
              <Pressable
                style={({ pressed }) => [
                  styles.addButtonDark,
                  pressed && { transform: [{ scale: 0.9 }] }
                ]}
              >
                <Text style={[styles.sCategory, { fontSize: 22 }]}>+</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.specialImageWrapper}>
          <View style={styles.specialImagePlaceholder} />
        </View>
      </Pressable>
    )
  }

  const [chatOpen, setChatOpen] = useState(false)

  return (
    <LinearGradient
      colors={['#b8e2ddff', '#e5f1f8ff', '#ffe5ddff']}
      style={[StyleSheet.absoluteFill, styles.screen]}
    >
      <View style={styles.topContainer}>
        <Text style={styles.title}>Yummi</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="black" />
          <TextInput
            style={{ marginLeft: 5, flex: 1 }}
            placeholder="Busca smoothies, jugos, bowls"
            placeholderTextColor="#7f8c9a"
          />
        </View>
        <View style={styles.filter}>
          <Ionicons name="filter" size={22} color="white" />
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* ==== BARRA LATERAL AJUSTADA ==== */}
        <View style={styles.catContainer}>
          <View style={styles.sidebarTitleBox}>
            <Text style={styles.sidebarTitle}>ESPECIAL DEL DÍA</Text>
          </View>

          <View style={styles.catListWrapper}>
            <Animated.View style={[styles.ball, { top: ballPosition }]} />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={category}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.catButton}
                  onPress={() => setSelCat(item)}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      selCat === item ? styles.sCategory : styles.category,
                      { transform: [{ rotate: '-90deg' }] }
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          {special ? (
            <SpecialCard item={special} />
          ) : (
            <View style={styles.specialLoading}>
              <Text style={styles.description}>Cargando especial...</Text>
            </View>
          )}

          <FlatList
            data={menu}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 6, paddingBottom: 8 }}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 8 }}>
                <OptionCard item={item} />
              </View>
            )}
          />
        </View>
      </View>

      <View style={styles.selectionCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.selectionIconOuter}>
            <View style={styles.selectionIconInner}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={26}
                color="#ffd446ff"
              />
            </View>
          </View>
          <View>
            <Text style={[styles.text, { fontSize: 14 }]}>
              Selección: 0 kcal
            </Text>
            <Text style={styles.description}>Goal: 2000 kcal</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => setChatOpen(true)}
        style={styles.chatFab}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      </Pressable>

      <Modal
        visible={chatOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setChatOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#F5FAF9' }}>
          <Pressable
            onPress={() => setChatOpen(false)}
            style={styles.chatClose}
          >
            <Ionicons name="close" size={22} color="#181F39" />
          </Pressable>
          <WaitiaChat />
        </View>
      </Modal>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 28,
    paddingHorizontal: 16
  },

  topContainer: {
    width: '100%'
  },

  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginTop: 8,
    color: '#1b2433'
  },

  searchContainer: {
    marginTop: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center'
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#d7ebf8ff',
    borderRadius: 18,
    marginRight: 10
  },

  filter: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#ff9b80ff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  mainContent: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 18,
    flex: 1
  },

  // ===== LATERAL =====
  catContainer: {
    width: 80,              // mismo ancho para texto y burbuja
    alignItems: 'center'
  },

  sidebarTitleBox: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },

  sidebarTitle: {
    fontFamily: 'BricolageGrotesque-SemiBold',
    fontSize: 11,
    color: '#1f2c3b',
    transform: [{ rotate: '-90deg' }],
    letterSpacing: 1.2
  },

  catListWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6
  },

  // Cada “casilla” de categoría
  catButton: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80                 // MISMO ancho que el contenedor
  },

  sCategory: {
    fontFamily: 'BricolageGrotesque-SemiBold',
    fontSize: 12,
    color: 'white',
    textAlign: 'center'
  },

  category: {
    fontFamily: 'BricolageGrotesque-Regular',
    fontSize: 12,
    color: '#00000055',
    width: 80,                // MISMO ancho ⇒ centrado con la burbuja
    textAlign: 'center'
  },

  // Burbuja animada perfectamente centrada
  ball: {
    position: 'absolute',
    left: 23,                 // (80 - 34) / 2 ⇒ centrado
    width: 34,
    height: 75,
    borderRadius: 20,
    backgroundColor: '#ff9b80ff'
  },

  // ===== DERECHA =====
  contentContainer: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 4
  },

  cardContainer: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#acd1f0ff'
  },

  specialCard: {
    backgroundColor: '#cfe8f2ff',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  specialImageWrapper: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },

  specialImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fefefe',
    borderWidth: 3,
    borderColor: '#ffb59aff'
  },

  optionCard: {
    backgroundColor: '#ffc0c0ff',
    flexDirection: 'row',
    alignItems: 'center'
  },

  optionLeft: {
    marginRight: 10
  },

  thumbPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffe7e2ff'
  },

  optionMiddle: {
    flex: 1
  },

  optionRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 52,
    marginLeft: 6
  },

  text: {
    fontFamily: 'Poppins-SemiBold',
    marginVertical: 2,
    maxWidth: 200,
    color: '#1f2c3b'
  },

  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    maxWidth: 220,
    color: '#4b5a6a'
  },

  chipRow: {
    marginTop: 6,
    flexDirection: 'row'
  },

  calChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e7f4ff55',
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 4
  },

  addButton: {
    marginTop: 6,
    backgroundColor: '#ff9b80ff',
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },

  addButtonDark: {
    backgroundColor: '#182e69ff',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  specialLoading: {
    paddingVertical: 10
  },

  selectionCard: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#ffffffff',
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3
  },

  selectionIconOuter: {
    backgroundColor: '#ffc0c0ff',
    borderRadius: 100,
    padding: 7,
    marginRight: 12
  },

  selectionIconInner: {
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 9
  },

  chatFab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
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
  },

  chatClose: {
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
  }
})
