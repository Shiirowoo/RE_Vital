import { Stack } from 'expo-router'

export default function Router(){
    return(
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='(tabs)'/>
        </Stack>
    )
}