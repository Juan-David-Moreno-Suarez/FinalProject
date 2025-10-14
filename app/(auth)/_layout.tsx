import { Stack } from "expo-router";

export default function Authlayout() {
  return (
    <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {backgroundColor: 'transparent'},
                animation: 'fade_from_bottom'
            }}
        >
            <Stack.Screen name = "login"/>
            <Stack.Screen name = "register"/>
        </Stack>
  )
}