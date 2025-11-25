import { DataProvider } from "@/contexts/DataContext";
import { Entypo, Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function MainLayout() {
    return (
        <DataProvider>
            <Tabs
                screenOptions={{
                    animation: 'shift',
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: { height: 70, backgroundColor: 'white' }
                }}
            >
                <Tabs.Screen name="home" options={{ tabBarIcon: ({ focused }) => <Feather name="home" size={24} color={focused ? '#1e5161ff' : '#1e516155'} /> }} />
                <Tabs.Screen name="chat" options={{ tabBarIcon: () => <Image style={{ height: 24, width: 24 }} source={require('../../assets/images/chatIcon.png')} /> }} />
                <Tabs.Screen name="cart" options={{ tabBarIcon: ({ focused }) => <Feather name="shopping-cart" size={24} color={focused ? '#1e5161ff' : '#1e516155'} /> }} />
                <Tabs.Screen name="pagos" options={{ href: null }} />
                <Tabs.Screen name="calificacion" options={{ href: null }} />
                <Tabs.Screen name="track" options={{ tabBarIcon: ({ focused }) => <Entypo name="location" size={24} color={focused ? '#1e5161ff' : '#1e516155'} /> }} />
                <Tabs.Screen name="(profile)" options={{ tabBarIcon: ({ focused }) => <Feather name="user" size={24} color={focused ? '#1e5161ff' : '#1e516155'} /> }} />
            </Tabs>
        </DataProvider>
    )
}