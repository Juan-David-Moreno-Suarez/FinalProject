import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                animation: 'slide_from_bottom',
                headerShown: false
            }}
        >
            <Stack.Screen name = "profile"/>
            <Stack.Screen name = "edit-profile"/>
        </Stack>
    )
}