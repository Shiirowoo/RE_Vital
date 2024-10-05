import { Stack } from 'expo-router';

export default function Router(){
    return(
        <Stack>
            <Stack.Screen name='registerEvento' options={{
                title: 'Registrar Evento',
                textAlign: 'center'
            }}/>
        </Stack>
    )
}