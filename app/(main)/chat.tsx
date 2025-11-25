// app/(main)/chat.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { askWaitia, type Turn } from '../../src/ai';
const WaitiaImg = require('../../assets/images/imagenchat.png');

// ======= Tokens Yummi =======
const Y = {
  ink: '#181F39',
  mint: '#ADD8CE',
  coral: '#FDA597',
  yellow: '#FEDA90',
  white: '#FFFFFF',
  g600: '#6B7280',
  card: 'rgba(255,255,255,0.92)',
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  r: { sm: 12, md: 20, lg: 28, xl: 36, full: 999 },
  pad: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 },
};

type Msg = { id: string; role: 'ai' | 'user' | 'scene'; text?: string };

const Chip = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 14,
      height: 36,
      borderRadius: Y.r.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Y.white,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      marginRight: 10,
      ...Y.shadow,
      shadowOpacity: 0.08,
      elevation: 0,
    }}
  >
    <Text style={{ color: Y.ink, fontSize: 14 }}>{label}</Text>
  </Pressable>
);

const Bubble = ({ role, children }: { role: 'ai' | 'user'; children: React.ReactNode }) => {
  const isAI = role === 'ai';
  return (
    <View
      style={{
        alignSelf: isAI ? 'flex-start' : 'flex-end',
        maxWidth: '84%',
        backgroundColor: isAI ? 'rgba(173,216,206,0.25)' : 'rgba(253,165,151,0.22)',
        borderRadius: Y.r.lg,
        padding: 14,
        marginVertical: 8,
        ...Y.shadow,
        shadowOpacity: 0.06,
        elevation: 0,
      }}
    >
      {children}
    </View>
  );
};

export default function WaitiaChat() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { id: 'scene-1', role: 'scene', text: '' },
    {
      id: 'ai-hello',
      role: 'ai',
      text:
        '¡Hola! Bienvenido a Yummi 🥝\nEstoy aquí para ayudarte a encontrar el plato perfecto. ' +
        '¿Tienes alguna preferencia, alergia o restricción dietética que deba conocer?',
    },
  ]);

  // Historial compacto (para enviar a askWaitia)
  const [history, setHistory] = useState<Turn[]>([]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  const send = async (value?: string) => {
    const content = (value ?? text).trim();
    if (!content) return;

    // pinta mensaje del usuario
    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', text: content };
    setMessages(m => [...m, userMsg]);
    setHistory(h => [...h, { role: 'user', text: content }]);
    setText('');

    try {
      const result = await askWaitia(content, history);
      const aiText = result?.reply ?? 'No tengo respuesta en este momento.';
      setMessages(m => [...m, { id: `a-${Date.now()}`, role: 'ai', text: aiText }]);
      setHistory(h => [...h, { role: 'model', text: aiText }]);
    } catch (e: any) {
      setMessages(m => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: 'ai',
          text:
            'No pude conectar con Waitia (HTTP).\n' +
            (e?.message ? String(e.message) : 'Error desconocido'),
        },
      ]);
    }
  };

  const onChip = (label: string) => send(label);

  return (
    <View style={{ flex: 1, backgroundColor: '#F5FAF9' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <LinearGradient
          colors={[Y.mint, Y.coral]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: Math.max(insets.top + 4, 30),
            paddingHorizontal: Y.pad.xl,
            paddingBottom: 34,
            borderBottomLeftRadius: Y.r.xl,
            borderBottomRightRadius: Y.r.xl,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Pressable
                style={{
                  backgroundColor: 'rgba(255,255,255,0.78)',
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: Y.r.full,
                  ...Y.shadow,
                  shadowOpacity: 0.08,
                  marginTop: 6,
                }}
              >
                <Text style={{ color: Y.ink, fontWeight: '700' }}>Home</Text>
              </Pressable>
            </View>

            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
              <Text
                style={{
                  color: Y.white,
                  fontSize: 26,
                  fontWeight: '900',
                  letterSpacing: 0.5,
                  textAlign: 'center',
                }}
              >
                ¡WAITIA!
              </Text>
            </View>

            <View style={{ flex: 1 }} />
          </View>

          {/* Barra carrito (placeholder – sin lógica de cart por ahora) */}
          <View
            style={{
              marginTop: 24,
              backgroundColor: Y.card,
              borderRadius: Y.r.full,
              paddingVertical: 10,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...Y.shadow,
            }}
          >
            <Text style={{ color: Y.ink }}>0 items • $0.00</Text>
            <Pressable
              style={{
                backgroundColor: Y.coral,
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: Y.r.full,
              }}
            >
              <Text style={{ color: Y.white, fontWeight: '700' }}>Ver carrito</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingHorizontal: Y.pad.xl,
            paddingTop: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: Y.card,
              borderRadius: Y.r.lg,
              padding: 16,
              marginBottom: 14,
              ...Y.shadow,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={WaitiaImg} resizeMode="contain" style={{ width: 84, height: 84, marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: Y.ink, fontSize: 16, fontWeight: '700' }}>¡Hola! Soy Waitia 👋</Text>
                <Text style={{ color: Y.g600, marginTop: 4 }}>¿Qué te gustaría explorar?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10 }}>
                  <Chip label="Alergias" onPress={() => onChip('Alergias')} />
                  <Chip label="Preferencias" onPress={() => onChip('Preferencias')} />
                  <Chip label="Platos del día" onPress={() => onChip('Platos del día')} />
                </ScrollView>
              </View>
            </View>
          </View>

          {messages.map(m =>
            m.role === 'scene' ? null : (
              <Bubble key={m.id} role={m.role}>
                <Text style={{ color: Y.ink, lineHeight: 22 }}>{m.text}</Text>
              </Bubble>
            ),
          )}
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            left: Y.pad.xl,
            right: Y.pad.xl,
            bottom: insets.bottom + 16,
            backgroundColor: Y.white,
            borderRadius: Y.r.full,
            paddingHorizontal: 12,
            alignItems: 'center',
            flexDirection: 'row',
            height: 52,
            ...Y.shadow,
            shadowOpacity: 0.08,
            elevation: 0,
          }}
        >
          <Pressable onPress={() => onChip('Recomiéndame')} style={{ padding: 8 }}>
            <Text style={{ fontWeight: '700', color: Y.g600 }}>/</Text>
          </Pressable>

          <TextInput
            placeholder="Cuéntame gustos o alergias…"
            placeholderTextColor="#9AA3AF"
            style={{ flex: 1, paddingVertical: 8, color: Y.ink }}
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => send()}
            returnKeyType="send"
          />

          <Pressable
            onPress={() => send()}
            style={{
              backgroundColor: Y.coral,
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 6,
            }}
          >
            <Ionicons name="arrow-up" size={18} color={Y.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
