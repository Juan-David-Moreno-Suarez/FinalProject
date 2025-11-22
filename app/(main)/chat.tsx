import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";

/* ---------- Tipos ---------- */
type Sender = "assistant" | "user";

type AssistantCardMessage = {
  id: string;
  from: "assistant";
  type: "card";
  title: string;
  text: string;
  quickReplies: string[];
};

type BubbleMessage = {
  id: string;
  from: Sender;
  type: "bubble";
  text: string;
};

type Message = AssistantCardMessage | BubbleMessage;

export default function chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      from: "assistant",
      type: "card",
      title: "¡Hola! Soy Waitia👋",
      text: "¿Qué te gustaría explorar?",
      quickReplies: ["Alergias", "Preferencias", "Platos del día"],
    },
    {
      id: "m2",
      from: "assistant",
      type: "bubble",
      text:
        "¡Perfecto! Puedo ayudarte con cualquier preferencia o restricción. ¿Qué te gustaría explorar primero?",
    },
  ]);

  const [input, setInput] = useState("");
  // ✅ Tipar el ref para poder usar scrollToEnd
  const listRef = useRef<FlatList<Message> | null>(null);

  // ✅ Hacer el parámetro opcional
  const onSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const userMsg: BubbleMessage = {
      id: Date.now().toString(),
      from: "user",
      type: "bubble",
      text: content,
    };
    const botMsg: BubbleMessage = {
      id: (Date.now() + 1).toString(),
      from: "assistant",
      type: "bubble",
      text: "Anotado ✅. (UI de ejemplo) Cuéntame más o elige una opción arriba.",
    };
    setMessages((s) => [...s, userMsg, botMsg]);
    setInput("");
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const handleQuick = (label: string) => onSend(label);

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0}
      >
        {/* Decoración superior */}
        <View style={styles.heroBackdrop}>
          <View style={styles.heroTintA} />
          <View style={styles.heroTintB} />
        </View>

        <View style={styles.container}>
          <Header />

          {/* Resumen carrito */}
          <View style={[styles.cartRow, shadow(8)]}>
            <View style={styles.cartLeft}>
              <Text style={styles.cartIcon}>🛒</Text>
              <Text style={styles.cartText}>3 items • $18.90</Text>
            </View>
            <Pressable style={styles.cartBtn}>
              <Text style={styles.cartBtnText}>Ver carrito</Text>
            </Pressable>
          </View>

          {/* Conversación */}
          <FlatList<Message>
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) =>
              item.type === "card" ? (
                <AssistantCard
                  title={item.title}
                  text={item.text}
                  quickReplies={item.quickReplies}
                  onQuickPress={handleQuick}
                />
              ) : (
                <Bubble text={item.text} from={item.from} />
              )
            }
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Barra de entrada */}
        <View style={[styles.inputBar, shadow(12)]}>
          <Text style={styles.inputPrefix}>🍓</Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Cuéntame gustos o alergias"
            placeholderTextColor="#97A3B0"
            style={styles.input}
            onSubmitEditing={() => onSend()}
            returnKeyType="send"
          />
          <Pressable onPress={() => onSend()} style={styles.sendBtn} hitSlop={10}>
            <Text style={styles.sendIcon}>{input.trim() ? "➤" : "🎙️"}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------------- Subcomponentes ---------------- */

function Header() {
  return (
    <View style={styles.header}>
      <Pressable style={[styles.headerIcon, shadow(4)]}>
        <Feather name="home" size={20} color='black' />
      </Pressable>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={styles.appTitle}>¡WAITIA! 🍓</Text>
        <Text style={styles.appSubtitle}>Tu mesera IA, lista para ayudarte 🍋</Text>
      </View>

      <View style={{ width: 36 }} />
    </View>
  );
}

type AssistantCardProps = {
  title: string;
  text: string;
  quickReplies?: string[];
  onQuickPress: (label: string) => void;
};

function AssistantCard({ title, text, quickReplies = [], onQuickPress }: AssistantCardProps) {
  return (
    <View style={styles.cardWrap}>
      <View style={[styles.card, shadow(10)]}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{text}</Text>

        <View style={styles.quickRow}>
          {quickReplies.map((q) => (
            <Pressable key={q} onPress={() => onQuickPress(q)} style={styles.quickChip}>
              <Text style={styles.quickTxt}>{q}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Sombrita oval */}
      <View style={styles.cardShadowOval} />
    </View>
  );
}

type BubbleProps = { text: string; from: Sender };

function Bubble({ text, from }: BubbleProps) {
  const isUser = from === "user";
  return (
    <View style={[styles.bubbleRow, isUser ? { justifyContent: "flex-end" } : null]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
          shadow(6),
        ]}
      >
        {!isUser && <Text style={styles.botBadge}>🤖</Text>}
        <Text style={[styles.bubbleTxt, isUser && { color: "white" }]}>{text}</Text>
      </View>
    </View>
  );
}

/* ---------------- Estilos ---------------- */

const BG = "#F6F7FB";
const TEXT = "#1F2937";
const MUTED = "#6B7280";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, paddingHorizontal: 16 },

  /* Hero / banda superior */
  heroBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 180,
  },
  heroTintA: {
    position: "absolute",
    left: -40,
    right: -40,
    top: -60,
    height: 180,
    backgroundColor: "#F4EFCF",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroTintB: {
    position: "absolute",
    left: -40,
    right: -40,
    top: 90,
    height: 90,
    backgroundColor: "#E6F5EF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconTxt: { fontSize: 18 },
  appTitle: { fontSize: 20, fontWeight: "800", color: TEXT },
  appSubtitle: { fontSize: 12, color: MUTED, marginTop: 2 },

  /* Cart summary */
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F8F6",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDEBE6",
    marginBottom: 12,
  },
  cartLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  cartIcon: { fontSize: 14, marginRight: 8 },
  cartText: { color: TEXT, fontWeight: "700" },
  cartBtn: {
    backgroundColor: "#F9D3D2",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F3B7B4",
  },
  cartBtnText: { color: "#7C3A3A", fontWeight: "800" },

  /* Assistant card */
  cardWrap: { marginBottom: 14 },
  card: {
    backgroundColor: "#ECF7F6",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DBEEEC",
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: TEXT, marginBottom: 6 },
  cardText: { color: TEXT, marginBottom: 10 },
  quickRow: { flexDirection: "row", flexWrap: "wrap" },
  quickChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E7EEF3",
  },
  quickTxt: { color: "#3B5B5A", fontWeight: "700" },

  cardShadowOval: {
    alignSelf: "center",
    width: 80,
    height: 12,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#E9EDF3",
    opacity: 0.8,
  },

  /* Burbujas */
  bubbleRow: { marginBottom: 12, flexDirection: "row" },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  bubbleAssistant: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E6ECF2",
    marginRight: "auto",
  },
  bubbleUser: {
    backgroundColor: "#F8B9B7",
    borderColor: "#F2A4A2",
    marginLeft: "auto",
  },
  botBadge: { marginBottom: 4 },

  bubbleTxt: { color: TEXT, fontSize: 14 },

  /* Input bar */
  inputBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6ECF2",
  },
  inputPrefix: { fontSize: 16, marginRight: 8 },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: TEXT,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD9D8",
    borderWidth: 1,
    borderColor: "#F4B7B6",
    marginLeft: 8,
  },
  sendIcon: { fontSize: 16, fontWeight: "800", color: "#7C3A3A" },
});

/* Helper de sombras */
function shadow(elevation = 8) {
  if (Platform.OS === "android") return { elevation };
  const op = 0.18 + Math.min(0.32, elevation * 0.01);
  return {
    shadowColor: "#000",
    shadowOpacity: op,
    shadowRadius: elevation,
    shadowOffset: { width: 0, height: Math.ceil(elevation / 2) },
  };
}
