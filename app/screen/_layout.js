import { Stack } from 'expo-router';

export default function Router(){
    return(
        <Stack>
            <Stack.Screen name='evento/registerEvento' options={{
                title: 'Registrar',
                textAlign: 'center'
            }}/>
            <Stack.Screen name='evento/editaEvento' options={{
                title: 'Editar/Excluir',
                textAlign: 'center'
            }}/>
            <Stack.Screen name='remed/registraRemed' options={{
                title: 'Registrar Remedio',
                textAlign: 'center'
            }}/>
        </Stack>
    )
}