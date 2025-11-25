import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";

const dim = useWindowDimensions()

export default function InfoModal({ visible, action }: any) {
    const [page, setPage] = useState(1)
    const scrollRef = useRef<ScrollView | null>(null)

    const goToPage = (nextPage: any) => {
        scrollRef.current?.scrollTo({ x: dim.width * nextPage, animated: true })
        setPage(nextPage)
    }

    const counterView = () => {
        return (
            <View style={styles.counterContainer}>
                <View style={[styles.counterDot, page == 1 ? { backgroundColor: '#233253ff', width: 30 } : { backgroundColor: '#d5d3e6ff', width: 10 }]} />
                <View style={[styles.counterDot, page == 2 ? { backgroundColor: '#233253ff', width: 30 } : { backgroundColor: '#d5d3e6ff', width: 10 }]} />
                <View style={[styles.counterDot, page == 3 ? { backgroundColor: '#233253ff', width: 30 } : { backgroundColor: '#d5d3e6ff', width: 10 }]} />
            </View>
        )
    }

    return (
        <Modal visible={visible} onRequestClose={action} >
            <ScrollView
                pagingEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={e => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / dim.width)
                    setPage(index + 1)
                }}
                ref={scrollRef}
            >
                <LinearGradient
                    colors={['#8fc3ecff', '#cce5f8ff', '#ffffffff']}
                    style={styles.page} >
                    <Image
                        source={require('../assets/images/modal1pic.jpg')}
                        style={{ height: 250, width: 250, borderRadius: 125 }}
                    />
                    <View style ={{height: 20}}/>
                    <Text style={styles.text} >Yummi</Text>
                    <Text style={styles.subtext} >Fresco y divertido</Text>
                    <Text style={styles.regtext} >Descubre menús deliciosos con el toque Yummi</Text>
                    <View style ={{height: 70}}/>

                </LinearGradient>
                <LinearGradient
                    colors={['#ec8f8fff', '#f8ccccff', '#ffffffff']}
                    style={styles.page} >
                    <Image
                        source={require('../assets/images/modal2pic.jpg')}
                        style={{ height: 370, width: 320, borderRadius: 30 }}
                    />
                    <View style ={{height: 30}}/>
                    <Text style={styles.subtext} >Crea tu orden</Text>
                    <Text style={styles.regtext} >Personaliza tamaños, toppings y todo lo que te gusta</Text>
                    <View style ={{height: 100}}/>
                </LinearGradient>
                <LinearGradient
                    colors={['#8fc3ecff', '#cce5f8ff', '#ffffffff']}
                    style={styles.page} >
                        <Image
                        source={require('../assets/images/modal3pic.jpg')}
                        style={{ height: 370, width: 200, borderRadius: 30 }}
                    />
                    <View style ={{height: 30}}/>
                    <Text style={styles.subtext} >Rastrea tu orden</Text>
                    <Text style={styles.regtext} >Sigue tu pedido en tiempo real, desde la cocina hasta tu mesa</Text>
                    <View style ={{height: 100}}/>
                </LinearGradient>
            </ScrollView>
            {counterView()}
            <Pressable
                onPress={page == 3 ? action : () => goToPage(page)}
                style={({ pressed }) => [styles.button, pressed && { transform: [{ scale: 0.9 }] }]}
            >
                <Text style={styles.bText} >{page == 3 ? 'Empezar' : 'Siguiente'}</Text>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    page: {
        height: dim.height,
        width: dim.width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    counterContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 50
    },
    counterDot: {
        borderRadius: 100,
        height: 10,
        margin: 10
    },
    text: {
        fontSize: 25,
        fontFamily: 'Poppins-Bold',
        color: '#233253ff',
        textAlign: 'center',
        margin: 10
    },
    subtext: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#233253ff',
        textAlign: 'center',
        maxWidth: '50%'
    },
    regtext: {
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        color: '#233253ff',
        textAlign: 'center',
        maxWidth: '60%'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '90%',
        bottom: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        padding: 8,
        backgroundColor: '#233253ff',
        elevation: 5
    },
    bText: {
        fontSize: 20,
        fontFamily: 'BricolageGrotesque-SemiBold',
        color: 'white'
    }
})