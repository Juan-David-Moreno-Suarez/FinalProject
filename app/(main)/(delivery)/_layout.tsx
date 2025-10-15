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
        </Tabs>
    )
}