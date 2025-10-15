import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
        screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: 'transparent'},
            animation: 'fade_from_bottom'
        }}
    >
        <Stack.Screen name = "index"/>
        <Stack.Screen name = "(auth)"/>
        <Stack.Screen name = "(main))"/>
    </Stack>
  )
}