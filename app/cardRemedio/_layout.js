import { Stack } from 'expo-router';

export default function Router(){

  return(
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='registraRemed' options={{
          presentation: 'modal'
        }}/>
        <Stack.Screen name='editaRemed' options={{
          presentation: 'modal'
        }}/>
        <Stack.Screen name='editaRemedC' options={{
          presentation: 'modal'
        }}/>
      </Stack>
  )
}