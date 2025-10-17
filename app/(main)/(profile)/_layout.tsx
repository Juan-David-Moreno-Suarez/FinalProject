import { Stack } from "expo-router";

export default function PLayout() {
    return (
        <Stack
            screenOptions={{
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name = "profile" />
            <Stack.Screen name = "edit-profile" />
        </Stack>
    )
}