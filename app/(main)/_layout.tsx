import { Tabs } from "expo-router";

export default function MainLayout() {
    return (
        <Tabs
            screenOptions={{
                animation: 'shift',
                headerShown: false
            }}
        >
            <Tabs.Screen name = "home"/>
            <Tabs.Screen name = "chat"/>
            <Tabs.Screen name = "cart"/>
            <Tabs.Screen name = "track"/>
            <Tabs.Screen name = "(profile)"/>
        </Tabs>
    )
}