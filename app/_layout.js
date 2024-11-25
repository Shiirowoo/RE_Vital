import { Stack } from 'expo-router';
import { SQLiteProvider } from "expo-sqlite";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
import dbCheck from './dbCheck';
import Permission from './notification';

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
    <SQLiteProvider databaseName="revital.db" onInit={dbCheck}>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='cardEvento'/>
        <Stack.Screen name='cardAgua'/>
        <Stack.Screen name='cardRemedio'/>
        <Stack.Screen name='cardPet'/>
        <Stack.Screen name='cardSono'/>
        <Stack.Screen name='cardFunction'/>
      </Stack>
    </SQLiteProvider>
  )
}

import * as FileSystem from 'expo-file-system';

// Caminho da pasta onde os bancos de dados são armazenados
const dbFolderPath = `${FileSystem.documentDirectory}SQLite/`;

// Função para deletar todos os bancos de dados
const deleteAllDatabases = async () => {
  try {
    // Obtém informações sobre os arquivos na pasta
    const folderInfo = await FileSystem.readDirectoryAsync(dbFolderPath);

    if (folderInfo.length > 0) {
      // Deleta todos os arquivos encontrados
      for (const file of folderInfo) {
        const filePath = `${dbFolderPath}${file}`;
        await FileSystem.deleteAsync(filePath);
        console.log(`Banco de dados ${file} deletado com sucesso.`);
      }
    } else {
      console.log('Nenhum banco de dados encontrado.');
    }
  } catch (error) {
    console.error('Erro ao deletar os bancos de dados:', error);
  }
};
