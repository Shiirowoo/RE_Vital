import { Stack } from 'expo-router';

export default function Router(){

  return(
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='regRemedio'/>
        <Stack.Screen name='regRemedioC'/>
      </Stack>
  )
}