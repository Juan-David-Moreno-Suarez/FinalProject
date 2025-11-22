import { Entypo, Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function MainLayout() {
    return (
        <Tabs
            screenOptions={{
                animation: 'shift',
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { height: 70,backgroundColor: 'white' }
            }}
        >
            <Tabs.Screen name = "home" options={{tabBarIcon: ({focused}) => <Feather name="home" size={24} color={focused? '#1e5161ff' : '#1e516155'} />}}/>
            <Tabs.Screen name = "chat" options={{tabBarIcon: ({focused}) => <Feather name="home" size={24} color={focused? '#1e5161ff' : '#1e516155'} />}}/>
            <Tabs.Screen name = "cart" options={{tabBarIcon: ({focused}) => <Feather name="shopping-cart" size={24} color={focused? '#1e5161ff' : '#1e516155'} />}}/>
            <Tabs.Screen name = "track" options={{tabBarIcon: ({focused}) => <Entypo name="location" size={24} color={focused? '#1e5161ff' : '#1e516155'} />}}/>
            <Tabs.Screen name = "(profile)" options={{tabBarIcon: ({focused}) => <Feather name="user" size={24} color={focused? '#1e5161ff' : '#1e516155'} />}}/>
        </Tabs>
    )
}