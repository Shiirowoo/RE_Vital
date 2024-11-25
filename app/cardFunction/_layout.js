import { Stack } from 'expo-router';

export default function Router(){

  return(
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='modalAgua' options={{
          presentation: 'transparentModal',
          headerShown: false
        }}/>
        <Stack.Screen name='modalSono' options={{
          presentation: 'transparentModal',
          headerShown: false
        }}/>
      </Stack>
  )
}