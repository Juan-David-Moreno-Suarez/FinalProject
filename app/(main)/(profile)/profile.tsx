import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  Image, // 👈 importamos Image
} from "react-native";

/* ---------- Tipos ---------- */
type TabKey = "summary" | "history" | "favorites";

type Order = {
  id: string;
  title: string;
  dateLabel: string;
  subtitle?: string;
  kcal: number;
  price: number;
  tags: string[];
  emoji?: string;
  favorite?: boolean;
};

type Pref = {
  id: string;
  label: string;
  group: "diet" | "allergen";
  tone?: "mint" | "danger" | "gray";
  active: boolean;
};

/* ---------- Datos de ejemplo ---------- */
const RECENT_ORDERS: Order[] = [
  {
    id: "1",
    title: "Bowl Mediterráneo",
    dateLabel: "28 Oct 2025",
    kcal: 420,
    price: 12.9,
    tags: ["Sin gluten"],
    emoji: "🥗",
  },
  {
    id: "2",
    title: "Ensalada Quinoa & Aguacate",
    dateLabel: "25 Oct 2025",
    kcal: 380,
    price: 10.5,
    tags: ["Sin lácteos"],
    emoji: "🥬",
  },
];

const HISTORY: Record<string, Order[]> = {
  "28 Oct 2025": [
    {
      id: "h1",
      title: "Bowl Mediterráneo",
      subtitle: "14:30 · Mesa · Entregado",
      dateLabel: "28 Oct 2025",
      kcal: 420,
      price: 12.9,
      tags: ["Sin gluten"],
      emoji: "🥗",
    },
    {
      id: "h2",
      title: "Wrap Pollo & Aguacate",
      subtitle: "13:15 · Para llevar · Entregado",
      dateLabel: "28 Oct 2025",
      kcal: 380,
      price: 10.5,
      tags: ["Sin lácteos"],
      emoji: "🌯",
    },
  ],
  "25 Oct 2025": [
    {
      id: "h3",
      title: "Ensalada Quinoa Power",
      subtitle: "13:00 · Mesa · Entregado",
      dateLabel: "25 Oct 2025",
      kcal: 350,
      price: 11.2,
      tags: ["Vegano"],
      emoji: "🥗",
    },
  ],
};

const PREFS_DEFAULT: Pref[] = [
  { id: "p1", label: "Vegetariano", group: "diet", tone: "mint", active: true },
  { id: "p2", label: "Vegano", group: "diet", tone: "gray", active: false },
  { id: "p3", label: "Keto", group: "diet", tone: "gray", active: false },
  { id: "p4", label: "Low-carb", group: "diet", tone: "gray", active: false },
  { id: "p5", label: "Sin azúcar", group: "diet", tone: "gray", active: false },

  { id: "a1", label: "Gluten", group: "allergen", tone: "danger", active: true },
  { id: "a2", label: "Lácteos", group: "allergen", tone: "danger", active: true },
  { id: "a3", label: "Nueces", group: "allergen", tone: "gray", active: false },
  { id: "a4", label: "Mariscos", group: "allergen", tone: "gray", active: false },
  { id: "a5", label: "Huevo", group: "allergen", tone: "gray", active: false },
  { id: "a6", label: "Soya", group: "allergen", tone: "gray", active: false },
];

/* ---------- Pantalla ---------- */
export default function ProfileScreen() {
  const [tab, setTab] = useState<TabKey>("summary");
  const [prefs, setPrefs] = useState<Pref[]>(PREFS_DEFAULT);
  const router = useRouter();

  const onLogOut = async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) {
      Alert.alert("Error", "Error logging out");
    } else {
      router.dismissTo("/");
    }
  };

  const ordersCount = 24;
  const spent = 348;

  const togglePref = (id: string) =>
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  return (
    <View style={styles.safe}>
      {/* Fondo decorativo */}
      <View style={styles.hero}>
        <View style={styles.heroTop} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header: dejamos el icono de logout solo como decoración (NO clickable) */}
          <HeaderPill />

          {/* Tarjeta principal */}
          <View style={[styles.mainCard, shadow(18)]}>
            {/* Avatar con imagen de perfil */}
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, shadow(8)]}>
                <Image
                  source={require('../../../assets/images/profilePic.jpeg')}
                  style={{ width: 96, height: 96, borderRadius: 48 }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.camBadge}>
                <Text style={{ fontSize: 12 }}>📸</Text>
              </View>
            </View>

            {/* Info básica */}
            <View style={[styles.infoCard, shadow(6)]}>
              <Text style={styles.name}>María González</Text>
              <Text style={styles.email}>maria.gonzalez@yummi.app</Text>
              <View style={styles.rolePill}>
                <Text style={styles.roleTxt}>Cliente</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <StatCard title="Pedidos" value={`${ordersCount}`} icon="🧾" />
              <StatCard title="Gastado" value={formatCurrency(spent)} icon="💵" />
            </View>

            {/* Tabs */}
            <TabBar active={tab} onChange={setTab} />
          </View>

          {tab === "summary" && <SummarySection />}
          {tab === "history" && <HistorySection />}
          {tab === "favorites" && (
            <FavoritesSection prefs={prefs} onToggle={togglePref} />
          )}

          {/* Ajustes rápidos (Solo el de abajo hace logout) */}
          {tab === "summary" && <SettingsList onLogout={onLogOut} />}
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Subcomponentes UI ---------- */

function HeaderPill() {
  return (
    <View style={styles.headerRow}>
      <View style={[styles.backPill, shadow(4)]}>
        <Text style={{ fontSize: 16 }}>‹</Text>
        <Text style={{ fontWeight: "800", marginLeft: 8 }}>Home</Text>
      </View>
    </View>
  );
}

type StatProps = { title: string; value: string; icon: string };
function StatCard({ title, value, icon }: StatProps) {
  return (
    <View style={[styles.statCard, shadow(4)]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </View>
  );
}

type TabBarProps = { active: TabKey; onChange: (t: TabKey) => void };
function TabBar({ active, onChange }: TabBarProps) {
  const Tab = ({ k, label }: { k: TabKey; label: string }) => {
    const isActive = active === k;
    return (
      <Pressable
        onPress={() => onChange(k)}
        style={[styles.tab, isActive && styles.tabActive]}
      >
        <Text style={[styles.tabTxt, isActive && styles.tabTxtActive]}>{label}</Text>
      </Pressable>
    );
  };
  return (
    <View style={styles.tabsRow}>
      <Tab k="summary" label="Resumen" />
      <Tab k="history" label="Historial" />
      <Tab k="favorites" label="Favoritos" />
    </View>
  );
}

/* ---------- Secciones ---------- */

function SummarySection() {
  return (
    <View>
      {/* Preferencias (chips) */}
      <View style={[styles.card, shadow(8)]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Preferencias</Text>
          <Pressable><Text style={styles.link}>Editar →</Text></Pressable>
        </View>
        <View style={styles.chipsWrap}>
          <Chip label="Sin gluten" tone="mint" />
          <Chip label="Vegetariano" tone="mint" />
          <Chip label="Sin lácteos" />
          <Chip label="< 500 kcal" />
        </View>
      </View>

      {/* Últimos pedidos */}
      <View style={{ marginTop: 14 }}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.sectionTitle}>Últimos pedidos</Text>
          <Pressable><Text style={styles.link}>Ver todos →</Text></Pressable>
        </View>
        {RECENT_ORDERS.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </View>
    </View>
  );
}

function HistorySection() {
  return (
    <View style={{ marginTop: 6 }}>
      {/* Filtros */}
      <View style={styles.filterRow}>
        <FilterChip label="Últ. 30 días" active />
        <FilterChip label="Este mes" />
        <FilterChip label="Calificados" />
      </View>
      <View style={styles.filterRow}>
        <FilterChip label="Reordenados" />
      </View>

      {/* Buscador */}
      <View style={[styles.searchBar, shadow(2)]}>
        <Text style={{ marginRight: 8 }}>🔎</Text>
        <TextInput
          placeholder="Buscar pedidos..."
          placeholderTextColor="#9AA5B1"
          style={{ flex: 1, height: 36 }}
        />
      </View>

      {/* Lista por fechas */}
      {Object.entries(HISTORY).map(([date, items]) => (
        <View key={date} style={{ marginTop: 16 }}>
          <Text style={styles.dateHeader}>{date}</Text>
          {items.map((o) => (
            <OrderCard key={o.id} order={o} showReceipt />
          ))}
        </View>
      ))}
    </View>
  );
}

type FavoritesProps = {
  prefs: Pref[];
  onToggle: (id: string) => void;
};
function FavoritesSection({ prefs, onToggle }: FavoritesProps) {
  const diet = prefs.filter((p) => p.group === "diet");
  const allerg = prefs.filter((p) => p.group === "allergen");

  return (
    <View style={{ marginTop: 6 }}>
      <View style={[styles.card, shadow(8)]}>
        <Text style={styles.sectionTitle}>Dieta</Text>
        <View style={styles.chipsWrap}>
          {diet.map((p) => (
            <SelectableChip key={p.id} label={p.label} active={p.active} tone={p.tone} onPress={() => onToggle(p.id)} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
          Alérgenos y restricciones
        </Text>
        <View style={styles.chipsWrap}>
          {allerg.map((p) => (
            <SelectableChip key={p.id} label={p.label} active={p.active} tone={p.tone} onPress={() => onToggle(p.id)} />
          ))}
        </View>
      </View>

      {/* Botones inferiores */}
      <View style={styles.actionsRow}>
        <Pressable style={[styles.actionBtn, styles.btnLight]}>
          <Text style={[styles.actionTxt, { color: "#374151" }]}>Cancelar</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.btnPrimary]}>
          <Text style={[styles.actionTxt, { color: "#fff" }]}>Guardar cambios</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ---------- Piezas reutilizables ---------- */

type ChipProps = { label: string; tone?: "mint" | "gray" };
function Chip({ label, tone = "gray" }: ChipProps) {
  const bg = tone === "mint" ? "#E6F5EF" : "#F3F6FA";
  const bd = tone === "mint" ? "#CDEBDD" : "#E6ECF2";
  const tx = tone === "mint" ? "#1F6A5C" : "#4B5563";
  return (
    <View style={[styles.chip, { backgroundColor: bg, borderColor: bd }]}>
      <Text style={{ color: tx, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

type SelectableChipProps = {
  label: string;
  active: boolean;
  tone?: "mint" | "danger" | "gray";
  onPress: () => void;
};
function SelectableChip({ label, active, tone = "gray", onPress }: SelectableChipProps) {
  const palette =
    tone === "danger"
      ? active
        ? { bg: "#FFE5E5", bd: "#FFCACA", tx: "#7C3A3A" }
        : { bg: "#FFFFFF", bd: "#F3E0E0", tx: "#7C3A3A" }
      : active
        ? { bg: "#E6F5EF", bd: "#CDEBDD", tx: "#1F6A5C" }
        : { bg: "#FFFFFF", bd: "#E6ECF2", tx: "#4B5563" };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: palette.bg, borderColor: palette.bd },
      ]}
    >
      <Text style={{ color: palette.tx, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}

type OrderCardProps = { order: Order; showReceipt?: boolean };
function OrderCard({ order, showReceipt }: OrderCardProps) {
  return (
    <View style={[styles.orderCard, shadow(8)]}>
      <View style={styles.orderHeaderRow}>
        <View style={styles.orderThumb}>
          <Text style={{ fontSize: 18 }}>{order.emoji ?? "🍽️"}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderTitle}>{order.title}</Text>
          <Text style={styles.orderSubtitle}>{order.subtitle ?? order.dateLabel}</Text>
          <View style={styles.orderChipsRow}>
            <Chip label={`${order.kcal} kcal`} />
            {order.tags.map((t) => (
              <Chip key={t} label={t} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.orderFooterRow}>
        <Text style={styles.orderPrice}>{formatCurrency(order.price)}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable style={styles.reorderBtn}>
            <Text style={styles.reorderTxt}>Reordenar</Text>
          </Pressable>
          {showReceipt ? (
            <Pressable><Text style={styles.link}>Ver recibo →</Text></Pressable>
          ) : (
            <Pressable style={styles.heartBtn}><Text>🤍</Text></Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

function SettingsList({ onLogout }: { onLogout: () => void }) {
  return (
    <View style={{ marginTop: 8, marginBottom: 20 }}>
      <SettingsRow icon="❓" title="Centro de ayuda" />
      <SettingsRow icon="📄" title="Términos y condiciones" />
      {/* 👇 SOLO este es funcional */}
      <SettingsRow icon="🚪" title="Cerrar sesión" danger onPress={onLogout} />
    </View>
  );
}

type SettingsRowProps = { icon: string; title: string; danger?: boolean; onPress?: () => void };
function SettingsRow({ icon, title, danger, onPress }: SettingsRowProps) {
  const Content = () => (
    <>
      <Text style={{ fontSize: 16, marginRight: 8 }}>{icon}</Text>
      <Text style={[styles.settingsTxt, danger && { color: "#B45309" }]}>{title}</Text>
      <View style={{ flex: 1 }} />
      <Text style={{ color: "#9AA5B1" }}>›</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={[styles.settingsRow, shadow(2)]}>
        <Content />
      </Pressable>
    );
    }
  return (
    <View style={[styles.settingsRow, shadow(2)]}>
      <Content />
    </View>
  );
}

/* ---------- Estilos ---------- */

const BG = "#F6F7FB";
const TEXT = "#111827";
const MUTED = "#6B7280";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { paddingHorizontal: 16 },

  /* Hero decorativo */
  hero: { position: "absolute", left: 0, right: 0, top: 0, height: 220 },
  heroTop: {
    position: "absolute",
    left: -50, right: -10, top: -40, height: 200,
    backgroundColor: "#EBD9D6",
    borderBottomRightRadius: 200,
  },
  headerRow: { marginTop: 8, marginBottom: 8, flexDirection: "row", alignItems: 'center', width: '100%' },
  backPill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#E6F5EF",
    borderColor: "#CDEBDD", borderWidth: 1,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
  },

  mainCard: { marginTop: 6 },

  /* Avatar */
  avatarWrap: { alignItems: "center", marginTop: 12 },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center",
    borderWidth: 6, borderColor: "#F9FAFB",
  },
  camBadge: {
    position: "absolute", right: "34%", top: 72,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "#ECFDF5",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#CDEBDD",
  },

  /* Info principal */
  infoCard: {
    marginTop: 10, backgroundColor: "#FFFFFF", borderRadius: 20,
    padding: 16, borderWidth: 1, borderColor: "#E6ECF2",
    alignItems: "center",
  },
  name: { fontSize: 22, fontWeight: "800", color: TEXT },
  email: { color: MUTED, marginTop: 4 },
  rolePill: {
    marginTop: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14,
    backgroundColor: "#F3F6FA", borderWidth: 1, borderColor: "#E6ECF2",
  },
  roleTxt: { color: "#374151", fontWeight: "800" },

  /* Stats */
  statsRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  statCard: {
    flex: 1, backgroundColor: "#FFFFFF", borderRadius: 16,
    paddingVertical: 14, alignItems: "center",
    borderWidth: 1, borderColor: "#E6ECF2",
  },
  statIcon: { fontSize: 16, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "800", color: TEXT },
  statLabel: { color: MUTED, marginTop: 2 },

  /* Tabs */
  tabsRow: {
    flexDirection: "row", gap: 8, marginTop: 14, marginBottom: 6,
  },
  tab: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
    backgroundColor: "#F0F2F6", borderWidth: 1, borderColor: "#E4E8EE",
  },
  tabActive: { backgroundColor: "#CDEFE7", borderColor: "#BFE7DC" },
  tabTxt: { color: "#374151", fontWeight: "700" },
  tabTxtActive: { color: "#1F6A5C", fontWeight: "800" },

  /* Cards & chips */
  card: {
    backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: "#E6ECF2", marginTop: 8,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: TEXT },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: TEXT },
  link: { color: "#1F6A5C", fontWeight: "800" },

  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    borderWidth: 1,
  },

  /* Order Card */
  orderCard: {
    backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: "#E6ECF2", marginTop: 10,
  },
  orderHeaderRow: { flexDirection: "row", gap: 10 },
  orderThumb: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: "#F3F6FA", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#E6ECF2",
  },
  orderTitle: { fontWeight: "800", color: TEXT },
  orderSubtitle: { color: MUTED, marginTop: 2 },
  orderChipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  orderFooterRow: { flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "space-between" },
  orderPrice: { fontWeight: "800", color: TEXT },
  reorderBtn: {
    backgroundColor: "#CDEFE7", borderColor: "#BFE7DC", borderWidth: 1,
    borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8,
  },
  reorderTxt: { color: "#1F6A5C", fontWeight: "800" },
  heartBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center",
    backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E6ECF2",
  },

  /* Filtros / search */
  filterRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  searchBar: {
    marginTop: 10, backgroundColor: "#FFFFFF", borderRadius: 18,
    paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#E6ECF2",
  },
  dateHeader: { marginTop: 2, color: TEXT, fontWeight: "800" },

  /* Settings */
  settingsRow: {
    marginTop: 10, padding: 14, borderRadius: 16,
    backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E6ECF2",
    flexDirection: "row", alignItems: "center",
  },
  settingsTxt: { color: TEXT, fontWeight: "700" },

  /* Favoritos acciones */
  actionsRow: { flexDirection: "row", gap: 10, marginTop: 10, marginBottom: 16 },
  actionBtn: {
    flex: 1, height: 46, borderRadius: 18, alignItems: "center", justifyContent: "center",
    borderWidth: 1,
  },
  btnLight: { backgroundColor: "#FFFFFF", borderColor: "#E6ECF2" },
  btnPrimary: { backgroundColor: "#1F2937", borderColor: "#1F2937" },
  actionTxt: { fontWeight: "800" },
});

/* ---------- Extras ---------- */
function FilterChip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View
      style={[
        styles.chip,
        active
          ? { backgroundColor: "#CDEFE7", borderColor: "#BFE7DC" }
          : { backgroundColor: "#F0F2F6", borderColor: "#E4E8EE" },
      ]}
    >
      <Text style={{ fontWeight: "800", color: active ? "#1F6A5C" : "#374151" }}>
        {label}
      </Text>
    </View>
  );
}

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