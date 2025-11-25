// components/calificacion.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
  Image,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


/** Pasos del modal */
type Step = "confirm" | "rate";

/** ✅ Imágenes en assets/images (desde components es ../assets/images/...) */
const celebrandoImg = require("../assets/images/celebrando.png");
const rogandoImg = require("../assets/images/rogando.png");

export default function CalificacionScreen() {
  const router = useRouter();

  // UI
  const [step, setStep] = useState<Step>("confirm");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // ratings
  const [ratingWaiter, setRatingWaiter] = useState(0);
  const [ratingApp, setRatingApp] = useState(0);
  const [comment, setComment] = useState("");

  // pedir permisos solo cuando el usuario abre el scanner
  const askPermission = async () => {
    if (hasPermission !== null) return;
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const openScanner = async () => {
    await askPermission();
    setScannerVisible(true);
  };

  const onScan = ({ data }: { data: string }) => {
    setScannerVisible(false);
    setStep("rate");
    // opcional: validar 'data'
  };

  const sendRating = () => {
    // opcional: enviar ratingWaiter, ratingApp, comment a backend
    router.replace("/(main)/home");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.roundBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={18} color="#0F172A" />
          </Pressable>

          <View style={styles.homePill}>
            <Ionicons name="home-outline" size={14} color="#0F172A" />
            <Text style={styles.homePillTxt}>Home</Text>
          </View>

          <Pressable style={styles.roundBtn}>
            <Ionicons name="share-social-outline" size={16} color="#0F172A" />
          </Pressable>
        </View>

        {/* Avatar/ilustración */}
        <LinearGradient
          colors={["#F9D3D0", "#F6E9E0", "#D9EEE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCircle}
        >
          <View style={styles.heroInner}>
            <Image
              source={step === "confirm" ? celebrandoImg : rogandoImg}
              resizeMode="contain"
              style={{ width: "80%", height: "80%" }}
            />
          </View>
        </LinearGradient>

        {step === "confirm" ? (
          <>
            <Text style={styles.titleCenter}>¡Pago confirmado!</Text>
            <Text style={styles.subCenter}>
              Tu pago se ha efectuado correctamente.{"\n"}
              Si pediste efectivo espera a tu meser@.
            </Text>

            <Pressable style={styles.scanBtn} onPress={openScanner}>
              <Ionicons name="scan-outline" size={16} color="#0F172A" />
              <Text style={styles.scanBtnTxt}>
                Escanea QR para calificar a tu mesero
              </Text>
            </Pressable>

            {/* Tarjeta cámara/QR — también permite avanzar */}
            <Pressable style={styles.camCard} onPress={() => setStep("rate")}>
              <View style={styles.camCardInner}>
                <Ionicons name="qr-code-outline" size={88} color="#0F172A" />
              </View>
            </Pressable>

            {/* Botón redondo inferior (adorno) */}
            <View style={styles.bottomIconWrap}>
              <Ionicons name="ellipse-outline" size={20} color="#F08C86" />
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.titleLeft, { marginTop: 8 }]}>
              Califica a tu mesero
            </Text>

            <View style={[styles.rateCard, styles.shadow]}>
              <Text style={styles.sectionTitle}>
                ¿Cómo te atendió tu mesero?
              </Text>

              <StarRow value={ratingWaiter} onChange={setRatingWaiter} />

              <View style={{ height: 10 }} />

              <TextInput
                placeholder="Deja un comentario..."
                placeholderTextColor="#9CA3AF"
                value={comment}
                onChangeText={setComment}
                style={styles.comment}
                multiline
              />

              <View style={{ height: 16 }} />

              <Text style={styles.sectionTitle}>
                Puntua el servicio de la app
              </Text>
              <StarRow value={ratingApp} onChange={setRatingApp} />

              <View style={{ height: 16 }} />

              <Pressable
                onPress={sendRating}
                style={{ borderRadius: 16, overflow: "hidden" }}
              >
                <LinearGradient
                  colors={["#BFE7DA", "#A7DFD0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitTxt}>Enviar calificación</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal Scanner */}
      <Modal visible={scannerVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <View style={styles.scannerHeader}>
            <Pressable
              style={styles.roundBtnDark}
              onPress={() => setScannerVisible(false)}
            >
              <Ionicons name="close" size={18} color="#fff" />
            </Pressable>
            <Text style={styles.scannerTitle}>Escanear QR</Text>
            <View style={{ width: 34 }} />
          </View>

          {hasPermission === false ? (
            <View style={styles.center}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Sin permisos de cámara. Concedelos en Ajustes.
              </Text>
            </View>
          ) : hasPermission === null ? (
            <View style={styles.center}>
              <Text style={{ color: "#fff" }}>Solicitando permisos…</Text>
            </View>
          ) : (
            <BarCodeScanner onBarCodeScanned={onScan} style={{ flex: 1 }} />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------- Subcomponentes ---------- */

function StarRow({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <Pressable key={n} onPress={() => onChange(n)} hitSlop={10}>
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={26}
              color={filled ? "#F4B266" : "#9CA3AF"}
              style={{ marginHorizontal: 6 }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Estilos ---------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  roundBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
  },
  homePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#CDEAE2",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  homePillTxt: { fontWeight: "800", color: "#0F172A", fontSize: 12 },

  /* Hero circle */
  heroCircle: {
    marginTop: 8,
    alignSelf: "center",
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  heroInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  /* Confirm view */
  titleCenter: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  subCenter: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 6,
  },
  scanBtn: {
    marginTop: 14,
    alignSelf: "center",
    backgroundColor: "#CDEAE2",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  scanBtnTxt: { fontWeight: "800", color: "#0F172A", fontSize: 12 },

  camCard: {
    marginTop: 18,
    alignSelf: "center",
    width: 230,
    height: 170,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#F6A9A5",
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  camCardInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
  },
  bottomIconWrap: {
    alignItems: "center",
    marginTop: 16,
  },

  /* Rate view */
  titleLeft: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    paddingHorizontal: 18,
  },
  rateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  shadow: {
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionTitle: { fontWeight: "800", color: "#0F172A", marginBottom: 8 },
  starsRow: { flexDirection: "row", alignItems: "center" },

  comment: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#111827",
  },

  submitBtn: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  submitTxt: { fontWeight: "900", color: "#0F172A" },

  /* Scanner modal */
  scannerHeader: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
  },
  roundBtnDark: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  scannerTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
