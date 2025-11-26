import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Rating } from "react-native-ratings";  


export default function CalificacionScreen() {
  const router = useRouter();
  
 
  const [ratingWaiter, setRatingWaiter] = useState(0);
  const [ratingApp, setRatingApp] = useState(0);
  const [comment, setComment] = useState("");

  const onSubmitRating = () => {

    Alert.alert("Calificación Enviada", "¡Gracias por tu calificación!");
    router.push("/home");  
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={['#F6CFCF', '#F7E6DE', '#DAF1EC']}
        style={styles.heroCircle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroInner}>
          <Image source={require('../../assets/images/rogando.png')} style = {{width: 200, height: 200}}/>
        </View>
      </LinearGradient>

      <Text style={styles.title}>Califica a tu mesero</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>¿Cómo te atendió tu mesero?</Text>
        <Rating
          imageSize={30}
          ratingCount={5}
          startingValue={ratingWaiter}
          onFinishRating={setRatingWaiter}
          style={styles.rating}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Deja un comentario..."
          placeholderTextColor="#9CA3AF"
          value={comment}
          onChangeText={setComment}
          multiline
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Puntúa el servicio de la app</Text>
        <Rating
          imageSize={30}
          ratingCount={5}
          startingValue={ratingApp}
          onFinishRating={setRatingApp}
          style={styles.rating}
        />
      </View>

      <Pressable style={styles.submitBtn} onPress={onSubmitRating}>
        <LinearGradient
          colors={['#FFB98A', '#FFCC8D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.submitBtnContainer}
        >
          <Text style={styles.submitText}>Enviar calificación</Text>
        </LinearGradient>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  heroCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  heroInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F6A9A5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  rating: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  textInput: {
    height: 100,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitBtn: {
    alignSelf: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    width: '100%',
    marginTop: 20,
  },
  submitBtnContainer: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#0F172A',
    fontWeight: '900',
  },
});