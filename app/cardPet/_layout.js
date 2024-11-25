import { Stack } from 'expo-router';

export default function Router(){

  return(
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='registerPet' options={{
          presentation: 'transparentModal',
          headerShown: false
        }}/><Stack.Screen name='editaPet' options={{
          presentation: 'transparentModal',
          headerShown: false
        }}/>
      </Stack>
  )
}