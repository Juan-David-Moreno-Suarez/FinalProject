import { Stack } from "expo-router";

export default function MainLayout() {
    return (
        <Stack
            screenOptions={{
                animation: 'slide_from_bottom',
                headerShown: false
            }}
        >
            <Stack.Screen name = '(delivery)' />
            <Stack.Screen name = '(table' />
        </Stack>
    )
}