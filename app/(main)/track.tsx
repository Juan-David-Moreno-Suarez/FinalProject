import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

/* ------------------ Tipos ------------------ */
type StepStatus = "done" | "current" | "pending";

type Step = {
  id: string;
  title: string;
  subtitle: string;
};

type OrderItem = {
  id: string;
  name: string;
  qty: number;
  kcal: number;
  price: number;
  note?: string;
};

/* ---- assets de los pasos (usa los nombres que me diste) ---- */
const stepIconByTitle: Record<string, any> = {
  Tomado: require("../../assets/images/Tomando.png"),
  "Avisado a cocina": require("../../assets/images/avisando a cocina.png"),
  "En preparación": require("../../assets/images/en preparacion.png"),
  Emplatando: require("../../assets/images/emplatando.png"),
  "En camino": require("../../assets/images/en camino.png"),
  Entregado: require("../../assets/images/entregado.png"),
};

/* ----------------- Pantalla ----------------- */
export default function Track() {
  const router = useRouter();

  const steps: Step[] = [
    { id: "s1", title: "Tomado", subtitle: "Tu orden ha sido recibida" },
    { id: "s2", title: "Avisado a cocina", subtitle: "La cocina ha recibido tu pedido" },
    { id: "s3", title: "En preparación", subtitle: "Chef Ana está cocinando" },
    { id: "s4", title: "Emplatando", subtitle: "Finalizando la presentación" },
    { id: "s5", title: "En camino", subtitle: "El mesero lleva tu pedido" },
    { id: "s6", title: "Entregado", subtitle: "¡Disfruta tu comida!" },
  ];

  // índice de la etapa actual
  const [current, setCurrent] = useState<number>(2);

  const order: OrderItem[] = [
    { id: "o1", name: "Pizza Margherita", qty: 1, kcal: 850, price: 18.5, note: "Extra queso" },
    { id: "o2", name: "Ensalada César", qty: 2, kcal: 420, price: 12.0 },
    { id: "o3", name: "Limonada Natural", qty: 1, kcal: 120, price: 4.5 },
  ];

  const subtotal = useMemo(() => order.reduce((acc, it) => acc + it.price, 0), [order]);
  const taxes = 6.89;
  const total = subtotal + taxes;

  const progress = (current / (steps.length - 1)) * 100;

  // simular avance (útil en demo)
  const advance = () => setCurrent((i) => Math.min(i + 1, steps.length - 1));

  const goBack = () => router.back();
  const goPay = () => router.push('/pagos');

  return (
    <SafeAreaView style={styles.safe}>
      {/* ---- HEADER tipo “pastilla” con degradado ---- */}
      <LinearGradient
        colors={["#F3B7B0", "#CFEFE8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, shadow(18)]}
      >
        <View style={styles.headerTopRow}>
          <Pressable style={styles.backBtn} onPress={goBack} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color="#2A3040" />
          </Pressable>
          <Text style={styles.headerTitle}>Seguimiento</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.headerChipsRow}>
          <Pill label="Mesa 12" tone="mint" large />
          <Pill label="Juan Perez" tone="white" large />
        </View>

        <Text style={styles.headerHint}>Te avisaremos en cada fase</Text>
      </LinearGradient>

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Timeline de estados */}
          <View style={[styles.cardOuter, shadow(14)]}>
            {steps.map((s, idx) => {
              const status: StepStatus =
                idx < current ? "done" : idx === current ? "current" : "pending";
              const isLast = idx === steps.length - 1;
              return (
                <StepRow
                  key={s.id}
                  index={idx}
                  title={s.title}
                  subtitle={s.subtitle}
                  status={status}
                  showConnector={!isLast}
                />
              );
            })}
          </View>

          {/* Tarjeta de estado (barra de progreso + cola) */}
          <View style={[styles.stateCard, shadow(10)]}>
            <View style={styles.progressRow}>
              <Text style={styles.timeText}>00:00</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>
            <View style={styles.queueRow}>
              <Pill label="En cola: #4" tone="mint" />
            </View>
            <Text style={styles.stateMsg}>Chef Ana está preparando tu orden.</Text>
          </View>

          {/* Resumen del pedido */}
          <OrderSummaryCard items={order} subtotal={subtotal} taxes={taxes} total={total} />
        </ScrollView>

        {/* ---- CTA inferior con botón PAGAR “pastilla” amarilla ---- */}
        <View style={[styles.bottomBar, shadow(16)]}>
          <Pressable style={styles.payBtn} onPress={goPay}>
            <Ionicons name="star-outline" size={20} color="#1B2533" style={{ marginRight: 10 }} />
            <Text style={styles.payBtnText}>PAGAR</Text>
          </Pressable>

          {/* (solo para demo) avanzar estado */}
          <Pressable onPress={advance} style={styles.advanceBtn} hitSlop={10}>
            <Text style={styles.advanceTxt}>Avanzar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ------------------ Subcomponentes ------------------ */

type PillProps = { label: string; tone?: "mint" | "white" | "gray"; large?: boolean };
function Pill({ label, tone = "gray", large = false }: PillProps) {
  const base = [styles.pill, large && styles.pillLg];
  let bg = "#F0F2F6",
    bd = "#E4E8EE",
    tx = "#374151";
  if (tone === "mint") {
    bg = "#D3F0E7";
    bd = "#BFE7DA";
    tx = "#1F6A5C";
  } else if (tone === "white") {
    bg = "#FFFFFF";
    bd = "#FFFFFF";
    tx = "#1F2937";
  }
  return (
    <View style={[...base, { backgroundColor: bg, borderColor: bd }]}>
      <Text style={[styles.pillTxt, { color: tx }]}>{label}</Text>
    </View>
  );
}

type StepRowProps = {
  index: number;
  title: string;
  subtitle: string;
  status: StepStatus;
  showConnector: boolean;
};
function StepRow({ title, subtitle, status, showConnector }: StepRowProps) {
  const done = status === "done";
  const current = status === "current";

  return (
    <View style={styles.stepRow}>
      {/* Columna izquierda: imagen del estado */}
      <View style={styles.leftCol}>
        <View style={[styles.iconWrap, shadow(6), current && { borderColor: "#00A88B" }]}>
          <Image source={stepIconByTitle[title]} resizeMode="cover" style={styles.stepImage} />
          {(done || current) && (
            <View style={styles.checkBadge}>
              <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>
            </View>
          )}
        </View>
        {showConnector && <View style={styles.connector} />}
      </View>

      {/* Contenido derecha */}
      <View style={styles.rightCol}>
        <View style={styles.stepHeader}>
          <Text style={[styles.stepTitle, status === "pending" && { opacity: 0.6 }]}>{title}</Text>
          <View>
            {done && <Badge label="Hecho" tone="done" />}
            {current && <Badge label="Actual" tone="current" />}
          </View>
        </View>
        <Text style={[styles.stepSub, status === "pending" && { opacity: 0.7 }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

type BadgeProps = { label: string; tone: "done" | "current" };
function Badge({ label, tone }: BadgeProps) {
  const bg = tone === "done" ? "#E6F6EB" : "#FFD9D8";
  const bd = tone === "done" ? "#C8EBD2" : "#F4B7B6";
  const tx = tone === "done" ? "#2E7D32" : "#7C3A3A";
  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: bd }]}>
      <Text style={[styles.badgeTxt, { color: tx }]}>{label}</Text>
    </View>
  );
}

type OrderSummaryCardProps = {
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  total: number;
};
function OrderSummaryCard({ items, subtotal, taxes, total }: OrderSummaryCardProps) {
  return (
    <View style={[styles.orderCard, shadow(14)]}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Tu pedido ({items.length})</Text>
        <Text style={styles.orderTotal}>{formatCurrency(total)}</Text>
      </View>

      {items.map((it) => (
        <View key={it.id} style={styles.orderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemLine}>
              {it.name} <Text style={styles.muted}>× {it.qty}</Text>
            </Text>
            {!!it.note && <Text style={styles.itemNote}>{it.note}</Text>}
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.kcal}>⚡ {it.kcal}</Text>
            <Text style={styles.price}>{formatCurrency(it.price)}</Text>
          </View>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.muted}>Subtotal</Text>
        <Text style={styles.muted}>{formatCurrency(subtotal)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.muted}>Impuestos</Text>
        <Text style={styles.muted}>{formatCurrency(taxes)}</Text>
      </View>

      <Pressable style={styles.addMoreBtn}>
        <Text style={styles.addMoreTxt}>Agregar algo más →</Text>
      </Pressable>
    </View>
  );
}

/* ------------------ Estilos ------------------ */

const BG = "#F6F7FB";
const TEXT = "#0F172A"; // oscuro
const MUTED = "#6B7280";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, paddingHorizontal: 16 },

  /* Header “pastilla” */
  headerGradient: {
    marginHorizontal: 12,
    marginTop: 6,
    borderRadius: 36,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "900",
    color: TEXT,
  },
  headerChipsRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 8,
    marginBottom: 6,
  },
  headerHint: {
    textAlign: "left",
    marginTop: 6,
    color: "#334155",
    fontWeight: "600",
  },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  pillLg: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
  },
  pillTxt: { fontWeight: "800" },

  /* Timeline card */
  cardOuter: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingRight: 12,
    marginTop: 14,
    marginBottom: 14,
  },

  stepRow: { flexDirection: "row", paddingVertical: 12 },
  leftCol: { width: 64, alignItems: "center" },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F6F7FB",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  stepImage: { width: "100%", height: "100%" },
  checkBadge: {
    position: "absolute",
    right: -4,
    top: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#00A88B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  connector: {
    width: 2,
    height: 30,
    marginTop: 8,
    backgroundColor: "#DDE5ED",
    borderRadius: 1,
  },
  rightCol: { flex: 1, paddingLeft: 8, paddingRight: 4 },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepTitle: { fontSize: 16, fontWeight: "800", color: TEXT },
  stepSub: { color: MUTED, marginTop: 4 },

  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeTxt: { fontWeight: "800", fontSize: 12 },

  /* Estado/barra */
  stateCard: {
    backgroundColor: "#E9F4F1",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D5EAE5",
    marginBottom: 12,
  },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  timeText: { color: MUTED, fontWeight: "600" },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#E6E9EE",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#FFB4B1", borderRadius: 8 },
  queueRow: { marginBottom: 8 },
  stateMsg: { color: TEXT },

  /* Order card */
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E9EDF3",
    marginTop: 4,
    marginBottom: 16,
  },
  orderHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  orderTitle: { flex: 1, color: TEXT, fontWeight: "800", fontSize: 16 },
  orderTotal: { fontWeight: "800", fontSize: 16, color: TEXT },
  orderRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 8 },
  itemLine: { color: TEXT, fontWeight: "700" },
  itemNote: { color: MUTED, marginTop: 2 },
  itemRight: { alignItems: "flex-end" },
  kcal: { color: MUTED, marginBottom: 2 },
  price: { color: TEXT, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#EEF2F6", marginVertical: 10 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  muted: { color: MUTED },

  addMoreBtn: { marginTop: 8 },
  addMoreTxt: { color: "#18A377", fontWeight: "700" },

  /* Bottom bar */
  bottomBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E6ECF2",
  },
  payBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFD78A",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  payBtnText: {
    color: "#1B2533",
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 15,
  },
  advanceBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  advanceTxt: { color: "#7C3A3A", fontWeight: "800" },
});

/* ---------- Utilidades ---------- */
function formatCurrency(n: number) {
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
