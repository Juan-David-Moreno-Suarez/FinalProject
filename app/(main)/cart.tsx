import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
  StatusBar
} from "react-native";

const initialItems = [
  {
    id: "1",
    name: "Berry Bliss Smoothie",
    emoji: "🥤",
    chips: ["Grande", "Hielo", "Miel"],
    kcal: 280,
    price: 8.99,
    qty: 1,
    accent: "#9be9d5ff",
    thumbBg: "#FFEDEB",
  },
  {
    id: "2",
    name: "Fresh Garden Salad",
    emoji: "🥗",
    chips: ["Mediano", "Aguacate", "Vinagreta"],
    kcal: 320,
    price: 20.98,
    qty: 2,
    accent: "#FFD6D6",
    thumbBg: "#FFF4E2",
  },
  {
    id: "3",
    name: "Chocolate Brownie",
    emoji: "🍫",
    chips: ["Porción", "Helado", "Nueces"],
    kcal: 450,
    price: 6.99,
    qty: 1,
    accent: "#FFE5A9",
    thumbBg: "#FFEDEE",
  },
];

export default function cart() {
  const [items, setItems] = useState(initialItems);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  );

  const inc = (id: any) =>
    setItems((s) => s.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)));
  const dec = (id: any) =>
    setItems((s) =>
      s.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
    );
  const removeItem = (id: any) => setItems((s) => s.filter((it) => it.id !== id));

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <Header />
        <Steps />
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ paddingBottom: 28, paddingTop: 28 }}
          renderItem={({ item }) => (
            <CartCard
              item={item}
              onInc={() => inc(item.id)}
              onDec={() => dec(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(total)}
          </Text>

          <Pressable style = {({pressed})=>[pressed && {transform: [{scale: 0.9}]}]}>
            <LinearGradient
              colors={['#f0a6a6ff', '#eee2d1ff', '#eee0cfff']}
              style={styles.payButton}
            >
            <Text style={styles.payText}>Ir a pagar</Text>
          </LinearGradient>
        </Pressable>

      </View>
    </View>
    </View >
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Pressable style={styles.headerIcon}>
        <Text style={styles.headerIconText}>‹</Text>
      </Pressable>
      <Text style={styles.headerTitle}>Tu carrito</Text>
      <Pressable style={styles.headerIconRight}>
        <Text style={styles.headerIconText}>×</Text>
      </Pressable>
    </View>
  );
}

function Steps() {
  return (
    <View style={styles.stepsRow}>
      <Step label="Carrito" active />
      <Step label="Pago" />
      <Step label="Confirmación" />
    </View>
  );
}

function Step({ label, active }: any) {
  return (
    <View style={[styles.step, active && styles.stepActive]}>
      <Text style={[styles.stepText, active && styles.stepTextActive]}>
        {label}
      </Text>
    </View>
  );
}

function CartCard({ item, onInc, onDec, onRemove }: any) {
  return (
    <View style={styles.cardWrap}>
      {/* barra/acento superior */}
      <View style={[styles.cardAccent, { backgroundColor: item.accent }]} />
      <View style={[styles.card, shadow(8)]}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.thumb, { backgroundColor: item.thumbBg }, shadow(4)]}>
            <Text style={styles.thumbEmoji}>{item.emoji}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <View style={styles.chipsRow}>
              {item.chips.map((c: any) => (
                <Chip key={c} label={c} />
              ))}
            </View>

            <View style={styles.kcalChip}>
              <Text style={styles.kcalBolt}>⚡</Text>
              <Text style={styles.kcalText}>{item.kcal}</Text>
            </View>
          </View>

        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>

          <View style={styles.stepper}>
            <Pressable onPress={onDec} style={styles.stepperBtn}>
              <Text style={styles.stepperSign}>−</Text>
            </Pressable>
            <Text style={styles.stepperQty}>{item.qty}</Text>
            <Pressable onPress={onInc} style={styles.stepperBtn}>
              <Text style={styles.stepperSign}>＋</Text>
            </Pressable>
          </View>
          <Pressable onPress={onRemove} hitSlop={10}>
            <Feather name="trash-2" size={20} color="#00000070" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Chip({ label }: any) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function formatCurrency(n: any) {
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

/* -------------------- Styles -------------------- */

const BG = "#F6F7FB";
const TEXT = "#1F2937";
const MUTED = "#6B7280";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: TEXT,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    ...shadow(4),
  },
  headerIconRight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    ...shadow(4),
  },
  headerIconText: {
    fontSize: 22,
    lineHeight: 22,
    color: TEXT,
    marginTop: -2,
  },

  /* Steps */
  stepsRow: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
    marginBottom: 5,
  },
  step: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#EAECEF",
  },
  stepActive: {
    backgroundColor: "#FFD8D8",
  },
  stepText: { color: MUTED, fontWeight: "600" },
  stepTextActive: { color: "#B94A52", fontWeight: "700" },

  /* Promo */
  promoWrap: {
    paddingVertical: 6,
  },
  promoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E9",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFE5A5",
  },
  promoTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "700",
  },
  promoSubtitle: {
    color: TEXT,
    fontSize: 14,
  },
  promoBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#E6F5EF",
    borderWidth: 1,
    borderColor: "#CDEBDD",
  },
  promoBtnText: {
    color: "#267A5A",
    fontWeight: "700",
  },

  /* Cards */
  cardWrap: { position: "relative" },
  cardAccent: {
    position: "absolute",
    height: 14,
    left: 12,
    right: 12,
    top: -6,
    borderRadius: 12,
    zIndex: 0,
    opacity: 0.9,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    zIndex: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  thumbEmoji: { fontSize: 28 },

  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: "#EEF2F7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: { color: MUTED, fontWeight: "600", fontSize: 12 },

  kcalChip: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#FFECC4",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  kcalBolt: { fontSize: 12 },
  kcalText: { fontSize: 12, fontWeight: "700", color: "#7F5B00" },

  trash: { fontSize: 20, marginLeft: 8 },

  priceRow: {
    marginTop: 12,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { fontSize: 18, fontWeight: "700", color: TEXT },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 18,
    paddingHorizontal: 6,
    marginLeft: 70,
    height: 40,
  },
  stepperBtn: {
    width: 36,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  stepperSign: { fontSize: 20, fontWeight: "700", marginTop: -2 },
  stepperQty: { width: 24, textAlign: "center", fontSize: 16, fontWeight: "700" },

  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...shadow(10),
  },
  totalLabel: { color: MUTED, fontWeight: "600" },
  totalValue: { flex: 1, textAlign: "right", fontSize: 16, fontWeight: "800", color: TEXT },
  payButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 25,
    width: 180,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row'
  },
  payText: { color: "black", fontFamily: 'BricolageGrotesque-Bold' },
});

/* Cross-platform shadow helper */
function shadow(elevation = 8) {
  if (Platform.OS === "android") return { elevation };
  // iOS
  const op = 0.18 + Math.min(0.32, elevation * 0.01);
  return {
    shadowColor: "#000",
    shadowOpacity: op,
    shadowRadius: elevation,
    shadowOffset: { width: 0, height: Math.ceil(elevation / 2) },
  };
}