import { Tabs } from "expo-router";

export default function TLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                animation: 'shift'
            }}
        >
            <Tabs.Screen name="home" />
            <Tabs.Screen name="progress" />
            <Tabs.Screen name="rating" />
        </Tabs>
    )
}