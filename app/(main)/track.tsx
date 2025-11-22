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
} from "react-native";

/* ------------------ Tipos ------------------ */
type StepStatus = "done" | "current" | "pending";

type Step = {
  id: string;
  title: string;
  subtitle: string;
  // status se calcula respecto al índice actual
};

type OrderItem = {
  id: string;
  name: string;
  qty: number;
  kcal: number;
  price: number;
  note?: string;
};

/* ----------------- Pantalla ----------------- */
export default function track() {
  const steps: Step[] = [
    { id: "s1", title: "Tomado", subtitle: "Tu orden ha sido recibida" },
    { id: "s2", title: "Avisado a cocina", subtitle: "La cocina ha recibido tu pedido" },
    { id: "s3", title: "En preparación", subtitle: "Chef Ana está cocinando" },
    { id: "s4", title: "Emplatando", subtitle: "Finalizando la presentación" },
    { id: "s5", title: "En camino", subtitle: "El mesero lleva tu pedido" },
    { id: "s6", title: "Entregado", subtitle: "¡Disfruta tu comida!" },
  ];

  // Índice de la etapa actual (0..steps.length-1)
  const [current, setCurrent] = useState<number>(2); // cambia según necesidad

  const order: OrderItem[] = [
    { id: "o1", name: "Pizza Margherita", qty: 1, kcal: 850, price: 18.5, note: "Extra queso" },
    { id: "o2", name: "Ensalada César", qty: 2, kcal: 420, price: 12.0 },
    { id: "o3", name: "Limonada Natural", qty: 1, kcal: 120, price: 4.5 },
  ];

  const subtotal = useMemo(
    () => order.reduce((acc, it) => acc + it.price, 0),
    [order]
  );
  const taxes = 6.89; // solo UI
  const total = subtotal + taxes;

  const progress = (current / (steps.length - 1)) * 100;

  // util para simular el avance (puedes quitarlo en producción)
  const advance = () => setCurrent((i) => Math.min(i + 1, steps.length - 1));

  return (
    <SafeAreaView style={styles.safe}>
      {/* Fondo/banda superior */}
      <View style={styles.heroBackdrop}>
        <View style={styles.heroTop} />
        <View style={styles.heroBottom} />
      </View>

      <View style={styles.container}>
        <Header />

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Chips de mesa y cliente */}
          <View style={styles.headerChipsRow}>
            <Pill label="Mesa 12" tone="mint" />
            <Pill label="Juan Perez" tone="gray" />
          </View>
          <Text style={styles.phaseHint}>Te avisaremos en cada fase</Text>

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

          {/* Tarjeta de estado (barra de progreso + mensajito) */}
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

        {/* CTA inferior */}
        <View style={[styles.bottomBar, shadow(16)]}>
          <Text style={styles.bottomIcon}>⭐</Text>
          <Pressable style={styles.payBtn}>
            <Text style={styles.payBtnText}>PAGAR</Text>
          </Pressable>

          {/* Botón para simular avance (quitar si no lo necesitas) */}
          <Pressable onPress={advance} style={styles.advanceBtn} hitSlop={10}>
            <Text style={styles.advanceTxt}>Avanzar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ------------------ Subcomponentes ------------------ */

function Header() {
  return (
    <View style={styles.headerRow}>
      <Pressable style={[styles.navBtn, shadow(4)]}>
        <Text style={styles.navBtnTxt}>‹</Text>
      </Pressable>
      <Text style={styles.title}>Seguimiento</Text>
      <View style={{ width: 36 }} />
    </View>
  );
}

type PillProps = { label: string; tone?: "mint" | "gray" };
function Pill({ label, tone = "gray" }: PillProps) {
  const s =
    tone === "mint"
      ? [styles.pill, styles.pillMint]
      : [styles.pill, styles.pillGray];
  const t =
    tone === "mint"
      ? [styles.pillTxt, { color: "#1F6A5C" }]
      : [styles.pillTxt, { color: "#374151" }];
  return (
    <View style={s}>
      <Text style={t}>{label}</Text>
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
function StepRow({ index, title, subtitle, status, showConnector }: StepRowProps) {
  const leftBg =
    status === "done" || status === "current" ? "#CDEFE7" : "#E8EDF3";
  const leftBorder = status === "current" ? "#00A88B" : "#FFFFFF";
  const icon = status === "done" ? "✔️" : status === "current" ? "⏳" : "•";

  return (
    <View style={styles.stepRow}>
      {/* Columna izquierda (icono + conector) */}
      <View style={styles.leftCol}>
        <View style={[styles.tickBox, { backgroundColor: leftBg, borderColor: leftBorder }, shadow(6)]}>
          <Text style={styles.tickIcon}>{icon}</Text>
        </View>
        {showConnector && <View style={styles.connector} />}
      </View>

      {/* Contenido */}
      <View style={styles.rightCol}>
        <View style={styles.stepHeader}>
          <Text style={[styles.stepTitle, status === "pending" && { opacity: 0.6 }]}>{title}</Text>
          <View>
            {status === "done" && <Badge label="Hecho" tone="done" />}
            {status === "current" && <Badge label="Actual" tone="current" />}
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

      {items.map((it, idx) => (
        <View key={it.id} style={styles.orderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemLine}>
              {it.name}  <Text style={styles.muted}>× {it.qty}</Text>
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
const TEXT = "#111827";
const MUTED = "#6B7280";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, paddingHorizontal: 16 },

  /* Hero */
  heroBackdrop: {
    position: "absolute",
    left: 0, right: 0, top: 0,
    height: 170,
  },
  heroTop: {
    position: "absolute",
    left: -30, right: -30, top: -40, height: 160,
    backgroundColor: "#EBD9D6", // rosado suave
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  heroBottom: {
    position: "absolute",
    left: -30, right: -30, top: 70, height: 110,
    backgroundColor: "#D8F1EB", // verde agua
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
  },
  navBtnTxt: { fontSize: 22, lineHeight: 22, color: TEXT, marginTop: -2 },
  title: { flex: 1, textAlign: "center", fontSize: 28, fontWeight: "800", color: TEXT },

  /* Chips fila */
  headerChipsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    marginBottom: 6,
  },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
    borderWidth: 1,
  },
  pillMint: { backgroundColor: "#E6F5EF", borderColor: "#CDEBDD" },
  pillGray: { backgroundColor: "#F0F2F6", borderColor: "#E4E8EE" },
  pillTxt: { fontWeight: "800" },

  phaseHint: { color: MUTED, marginBottom: 12 },

  /* Timeline card */
  cardOuter: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingRight: 12,
    marginBottom: 14,
  },

  stepRow: { flexDirection: "row", paddingVertical: 10 },
  leftCol: { width: 64, alignItems: "center" },
  tickBox: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 4, alignItems: "center", justifyContent: "center",
  },
  tickIcon: { fontSize: 20 },
  connector: {
    width: 2, height: 28, marginTop: 6,
    backgroundColor: "#DDE5ED",
    borderRadius: 1,
  },
  rightCol: { flex: 1, paddingLeft: 8, paddingRight: 4 },
  stepHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepTitle: { fontSize: 16, fontWeight: "800", color: TEXT },
  stepSub: { color: MUTED, marginTop: 4 },

  badge: {
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, alignSelf: "flex-start",
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
    flex: 1, height: 10, backgroundColor: "#E6E9EE", borderRadius: 8, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#FFB4B1", borderRadius: 8 },
  queueRow: { marginBottom: 8 },
  stateMsg: { color: TEXT },

  /* Order card */
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1, borderColor: "#E9EDF3",
    marginTop: 4, marginBottom: 16,
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
    position: "absolute", left: 12, right: 12, bottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 24, padding: 10,
    flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: 1, borderColor: "#E6ECF2",
  },
  bottomIcon: { fontSize: 16, marginLeft: 6 },
  payBtn: {
    flex: 1,
    height: 48, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#111827",
  },
  payBtnText: { color: "#FFFFFF", fontWeight: "800", letterSpacing: 1 },
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
