import { Stack } from 'expo-router';
import { SQLiteProvider } from "expo-sqlite";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
import dbCheck from './dbCheck'
import Permission from './notification/notificationPermission'

export default function Router(){
  Permission()

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black
  });
  
  if (!fontsLoaded) {
    return null;
  }

  return(
    <SQLiteProvider databaseName="memory" onInit={dbCheck}>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='screen'/>
      </Stack>
    </SQLiteProvider>
  )
}

import * as FileSystem from 'expo-file-system';

// Nome do banco de dados que você deseja deletar
const dbName = 'revital.db';

// Caminho completo do banco de dados
const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

// Função para deletar o banco de dados
const deleteDatabase = async () => {
  try {
    // Verifica se o arquivo do banco de dados existe
    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (fileInfo.exists) {
      // Deleta o arquivo do banco de dados
      await FileSystem.deleteAsync(dbPath);
      console.log('Banco de dados deletado com sucesso.');
    } else {
      console.log('Banco de dados não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao deletar o banco de dados:', error);
  }
};
