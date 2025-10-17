import { Tabs } from "expo-router";

export default function DLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                animation: 'shift'
            }}
        >
            <Tabs.Screen name = "home"/>
            <Tabs.Screen name = "chat"/>
            <Tabs.Screen name = "cart"/>
            <Tabs.Screen name = "location"/>
            <Tabs.Screen name = "rating"/>
        </Tabs>
    )
}