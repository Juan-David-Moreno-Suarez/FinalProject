import { DataContext } from "@/contexts/DataContext";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
import { Alert, FlatList, Modal, Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useCart } from "../../contexts/CartContext";

export default function Cart() {
  const { cartItems, removeItemFromCart, updateItemQty, clearCart } = useCart();
  const { createOrder } = useContext(DataContext);
  const [tableModalVisible, setTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const router = useRouter();

  const total = useMemo(
    () => cartItems.reduce((acc: any, it: any) => acc + it.price * it.qty, 0),
    [cartItems]
  );

  const inc = (id: any) =>
    updateItemQty(
      id,
      cartItems.find((it: any) => it.id === id)?.qty + 1 || 1
    );
  const dec = (id: any) =>
    updateItemQty(
      id,
      cartItems.find((it: any) => it.id === id)?.qty - 1 || 1
    );

  const tables = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleConfirmOrder = async () => {
    if (selectedTable == null) {
      Alert.alert("Mesa no seleccionada", "Por favor elige un número de mesa.");
      return;
    }

    await createOrder(cartItems, selectedTable)
    clearCart()
    Alert.alert(
      "Orden iniciada",
      `Se ha comenzado la orden para la mesa ${selectedTable}.`
    );
    setTableModalVisible(false);
  };

  const handleActionButton = () => {
    if (cartItems.length === 0) {
      router.navigate('/(main)/home')
    } else {
      setTableModalVisible(true)
      setIsButtonDisabled(false)
    }
  };

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <Header />
        <Steps />

        {Array.isArray(cartItems) && cartItems.length > 0 ? (
          <FlatList
            data={cartItems}
            keyExtractor={(it) => it.id}
            contentContainerStyle={{ paddingBottom: 28, paddingTop: 28 }}
            renderItem={({ item }) => (
              <CartCard
                item={item}
                onInc={() => inc(item.id)}
                onDec={() => dec(item.id)}
                onRemove={() => removeItemFromCart(item)}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.emptyCartText}>El carrito está vacío</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>

          <Pressable
            style={({ pressed }) => [pressed && { transform: [{ scale: 0.9 }] }]}
            onPress={handleActionButton}
          >
            <LinearGradient
              colors={["#f0a6a6ff", "#eee2d1ff", "#eee0cfff"]}
              style={styles.payButton}
            >
              <Text style={styles.payText}>
                {cartItems.length === 0 ? "Escoger platos" : "Hacer pedido"}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <Modal
        transparent
        visible={tableModalVisible}
        animationType="fade"
        onRequestClose={() => setTableModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Selecciona el número de mesa</Text>

            <View style={styles.tablesWrap}>
              {tables.map((num) => (
                <Pressable
                  key={num}
                  onPress={() => setSelectedTable(num)}
                  style={[
                    styles.tableChip,
                    selectedTable === num && styles.tableChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.tableChipText,
                      selectedTable === num && styles.tableChipTextSelected,
                    ]}
                  >
                    {num}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalButtonsRow}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => {
                  setTableModalVisible(false);
                  setSelectedTable(null);
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                disabled={isButtonDisabled}
                style={[styles.modalConfirmButton, isButtonDisabled && { backgroundColor: '#B0B0B0' }]}
                onPress={() => {
                  setIsButtonDisabled(true)
                  handleConfirmOrder()
                }}
              >
                <Text style={styles.modalConfirmText}>Finalizar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
      <View style={[styles.cardAccent, { backgroundColor: "#fccdcdff" }]} />
      <View style={[styles.card, shadow(8)]}>
        <View style={styles.cardHeaderRow}>
          <View
            style={[styles.thumb, { backgroundColor: "#e1f8f2ff" }, shadow(4)]}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <View style={styles.chipsRow}>
              <Text style={styles.chipText}>{item.description}</Text>
            </View>

            <View style={styles.kcalChip}>
              <Text style={styles.kcalBolt}>⚡</Text>
              <Text style={styles.kcalText}>{item.calories}</Text>
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

function formatCurrency(n: any) {
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

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
  emptyCartText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#7F8C9A",
    marginTop: 20,
  },
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
  stepperQty: {
    width: 24,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },

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
  totalValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
  },
  payButton: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 25,
    width: 180,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: "row",
  },
  payText: { color: "black", fontFamily: "BricolageGrotesque-Bold" },

  /* ===== Modal styles ===== */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 14,
    textAlign: "center",
  },
  tablesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  tableChip: {
    minWidth: 40,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  tableChipSelected: {
    backgroundColor: "#FFD8D8",
    borderColor: "#F97373",
  },
  tableChipText: {
    color: TEXT,
    fontWeight: "600",
  },
  tableChipTextSelected: {
    color: "#B91C1C",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalCancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modalCancelText: {
    color: MUTED,
    fontWeight: "600",
  },
  modalConfirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#FFD8D8",
  },
  modalConfirmText: {
    color: "#B94A52",
    fontWeight: "700",
  },
});

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
