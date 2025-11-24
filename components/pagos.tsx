import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Method = 'cash' | 'card';

export default function Pagos() {
  const router = useRouter();

  // --------- Estado UI ----------
  const [method, setMethod] = useState<Method>('cash');
  const [tipPct, setTipPct] = useState<number>(0.10);

  // Datos (mock)
  const SUBTOTAL = 39096; // COP
  const SHIPPING = 3096;
  const TAXES = 3096;

  const tipAmount = useMemo(() => Math.round(SUBTOTAL * tipPct), [SUBTOTAL, tipPct]);
  const totalCash = useMemo(() => SUBTOTAL + SHIPPING + TAXES + tipAmount, [SUBTOTAL, SHIPPING, TAXES, tipAmount]);
  const totalCard = useMemo(() => SUBTOTAL + TAXES + tipAmount, [SUBTOTAL, TAXES, tipAmount]);

  const proceed = () => {
    // ⚠️ Navega sin el grupo (main)
    router.push('/calificacion');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header degradado */}
      <LinearGradient
        colors={['#F6CFCF', '#F7E6DE', '#DAF1EC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGrad}
      >
        <View style={styles.headerTopRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#1F2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Pago</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.stepRow}>
          <StepChip label="Carrito" />
          <StepChip label="Pago" active />
          <StepChip label="Confirmación" />
        </View>
      </LinearGradient>

      {/* Contenido */}
      <View style={styles.container}>
        {/* Toggle Efectivo / Tarjeta */}
        <View style={[styles.segment, shadow(8)]}>
          <SegmentBtn label="Efectivo" active={method === 'cash'} onPress={() => setMethod('cash')} />
          <SegmentBtn label="Tarjeta" active={method === 'card'} onPress={() => setMethod('card')} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {method === 'cash' ? (
            <>
              {/* Tarjeta con imagen y mensaje */}
              <View style={[styles.card, shadow(12)]}>
                <Text style={styles.cardMsg}>Tu meser@ asignado está en camino</Text>
                <Image
                  // ↙️ desde components/ a assets/images/ es ../
                  source={require('../assets/images/efectivo.png')}
                  // si tu archivo se llama 'efectivo.png', cambia la línea de arriba
                  resizeMode="contain"
                  style={{ width: '100%', height: 120, marginTop: 8 }}
                />
              </View>

              {/* Resumen efectivo (incluye Envío) */}
              <View style={{ gap: 10 }}>
                <Row label="Subtotal" value={formatCOP(SUBTOTAL)} muted />
                <Row label="Envío" value={formatCOP(SHIPPING)} muted />
                <Row label="Impuestos" value={formatCOP(TAXES)} muted />
              </View>

              <TipSelector tipPct={tipPct} onChange={setTipPct} />

              <Row label={`Propina (${Math.round(tipPct * 100)}%)`} value={formatCOP(tipAmount)} muted />

              <View style={styles.totalWrap}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCOP(totalCash)}</Text>
              </View>
            </>
          ) : (
            <>
              {/* Form tarjeta */}
              <View style={[styles.card, shadow(12)]}>
                <LabeledInput
                  label="Número de tarjeta"
                  placeholder="1234 5678 9012 3456"
                  icon="card-outline"
                />
                <LabeledInput
                  label="Titular de la tarjeta"
                  placeholder="Juan Pérez"
                  containerStyle={{ marginTop: 12 }}
                />

                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                  <View style={{ flex: 1 }}>
                    <LabeledInput label="Vencimiento" placeholder="MM/AA" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <LabeledInput label="CVV" placeholder="123" rightIcon="eye-off-outline" />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 8 }}>
                  <Text style={{ color: '#6B7280', fontWeight: '600' }}>Aceptamos:</Text>
                  <Chip text="Visa" />
                  <Chip text="Mastercard" />
                </View>
              </View>

              {/* Resumen tarjeta (sin envío) */}
              <View style={[styles.card, shadow(10)]}>
                <Text style={styles.resumeTitle}>Resumen</Text>
                <View style={{ height: 8 }} />
                <Row label="Subtotal" value={formatCOP(SUBTOTAL)} muted />
                <Row label="Impuestos" value={formatCOP(TAXES)} muted />

                <View style={{ height: 8 }} />
                <TipSelector tipPct={tipPct} onChange={setTipPct} />
                <Row label={`Propina (${Math.round(tipPct * 100)}%)`} value={formatCOP(tipAmount)} muted />

                <View style={[styles.totalWrap, { marginTop: 10 }]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatCOP(totalCard)}</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* Botón inferior “Proceder” */}
        <View style={[styles.bottomBar, shadow(16)]}>
          <Pressable style={{ flex: 1, borderRadius: 18, overflow: 'hidden' }} onPress={proceed}>
            <LinearGradient
              colors={['#FFB98A', '#FFCC8D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.proceedBtn}
            >
              <Text style={styles.proceedTxt}>Proceder</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- Subcomponentes ---------------- */

function StepChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.stepChip, active ? styles.stepChipActive : styles.stepChipIdle]}>
      <Text style={[styles.stepChipTxt, active && { color: '#0F172A' }]}>{label}</Text>
    </View>
  );
}

function SegmentBtn({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentBtn, active && styles.segmentBtnActive]}>
      <Text style={[styles.segmentTxt, active && styles.segmentTxtActive]}>{label}</Text>
    </Pressable>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, muted && { color: '#6B7280' }]}>{label}</Text>
      <Text style={[styles.rowValue, muted && { color: '#6B7280' }]}>{value}</Text>
    </View>
  );
}

function LabeledInput({
  label,
  placeholder,
  icon,
  rightIcon,
  containerStyle,
}: {
  label: string;
  placeholder?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: any;
}) {
  return (
    <View style={[containerStyle]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon && <Ionicons name={icon} size={16} color="#9CA3AF" style={{ marginRight: 8 }} />}
        <TextInput placeholder={placeholder} placeholderTextColor="#9CA3AF" style={{ flex: 1, color: '#111827' }} />
        {rightIcon && <Ionicons name={rightIcon} size={16} color="#9CA3AF" />}
      </View>
    </View>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <View style={styles.brandChip}>
      <Text style={{ fontWeight: '800', color: '#1F2937', fontSize: 12 }}>{text}</Text>
    </View>
  );
}

function TipSelector({
  tipPct,
  onChange,
}: {
  tipPct: number;
  onChange: (v: number) => void;
}) {
  const options = [0, 0.05, 0.1, 0.15];
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ color: '#6B7280', marginBottom: 8 }}>Propina</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {options.map((p) => {
          const active = tipPct === p;
          return (
            <Pressable key={p} onPress={() => onChange(p)} style={[styles.tipBtn, active && styles.tipBtnActive]}>
              <Text style={[styles.tipTxt, active && styles.tipTxtActive]}>{Math.round(p * 100)}%</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* ---------------- Utilidades ---------------- */

function formatCOP(n: number) {
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function shadow(elevation = 8) {
  if (Platform.OS === 'android') return { elevation };
  const op = 0.18 + Math.min(0.32, elevation * 0.01);
  return {
    shadowColor: '#000',
    shadowOpacity: op,
    shadowRadius: elevation,
    shadowOffset: { width: 0, height: Math.ceil(elevation / 2) },
  };
}

/* ---------------- Estilos ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  headerGrad: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  stepChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  stepChipIdle: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  stepChipActive: { backgroundColor: '#FFECE5', borderColor: '#FBD5CE' },
  stepChipTxt: { fontWeight: '800', color: '#6B7280', fontSize: 12 },

  container: { flex: 1, paddingHorizontal: 16 },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    padding: 6,
    marginTop: 12,
  },
  segmentBtn: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: { backgroundColor: '#BDE6D9' },
  segmentTxt: { color: '#6B7280', fontWeight: '800' },
  segmentTxtActive: { color: '#0F172A' },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardMsg: { color: '#111827', fontWeight: '700' },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  rowLabel: { color: '#111827', fontWeight: '600' },
  rowValue: { color: '#111827', fontWeight: '600' },

  resumeTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },

  tipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#EEF2F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipBtnActive: { backgroundColor: '#FFE3C6', borderColor: '#FCD2A7' },
  tipTxt: { color: '#6B7280', fontWeight: '800' },
  tipTxtActive: { color: '#0F172A' },

  totalWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  totalLabel: { color: '#111827', fontWeight: '800' },
  totalValue: { color: '#111827', fontWeight: '900', fontSize: 18 },

  inputLabel: { color: '#6B7280', fontWeight: '700', marginBottom: 6 },
  inputWrap: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  proceedBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedTxt: { color: '#0F172A', fontWeight: '900', letterSpacing: 0.5 },
});
