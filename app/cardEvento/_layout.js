import { Stack } from 'expo-router';

export default function Router(){

  return(
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='registerEvento' options={{
          presentation: 'transparentModal',
          headerShown: false
        }}/>
        <Stack.Screen name='editaEvento' options={{
          presentation: 'transparentModal',
          headerShown: false
        }}/>
      </Stack>
  )
}