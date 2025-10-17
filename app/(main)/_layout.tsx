import { Stack } from "expo-router";

export default function MainLayout() {
    return (
        <Stack
            screenOptions={{
                animation: 'slide_from_bottom',
                headerShown: false
            }}
        >
            <Stack.Screen name = 'home' />
            <Stack.Screen name = 'posts' />
            <Stack.Screen name = '(profile)' />
        </Stack>
    )
}