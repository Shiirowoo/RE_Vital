import { Tabs } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";

export default function Router(){
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold
      });
    
      if (!fontsLoaded) {
        return null;
      }

    const color = "#0000b4"
    dbCheck();
    return(
        <SQLiteProvider databaseName="revital.db">
            <Tabs
            screenOptions={{
                headerShown: false
            }}>                                                                                                                                                                            
                <Tabs.Screen name="agua" options={{
                    title: "Água",
                    tabBarIcon: ({color}) => <Ionicons name="water" size={28} color={color} />,
                    tabBarActiveTintColor: color,
                    tabBarInactiveTintColor: 'gray',
                }}/>
                <Tabs.Screen name="index" options={{
                    title: "Home",
                    tabBarIcon: ({color}) => <Entypo name="home" size={32} color={color} />,
                    tabBarActiveTintColor: color,
                    tabBarInactiveTintColor: 'gray',
                }}/>
                <Tabs.Screen name="sono" options={{
                    title: "Dormir",
                    tabBarIcon: ({color}) => <MaterialCommunityIcons name="sleep" size={28} color={color} />,
                    tabBarActiveTintColor: color,
                    tabBarInactiveTintColor: 'gray',
                }}/>
            </Tabs>
        </SQLiteProvider>
    )
}

async function dbCheck(){
    const db = await SQLite.openDatabaseAsync('revital.db')

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_key = ON;

        CREATE TABLE IF NOT EXISTS person(
            idPerson INTEGER PRIMARY KEY AUTOINCREMENT,
            personPeso REAL,
            personHSono TEXT,
            personPet INTEGER
        );

        CREATE TABLE IF NOT EXISTS sono(
            idSono INTEGER PRIMARY KEY AUTOINCREMENT,
            sonoDateIni TEXT,
            sonoDateFim TEXT,
            idPerson INTEGER,
            FOREIGN KEY (idPerson) REFERENCES person(idPerson)
        );

        CREATE TABLE IF NOT EXISTS agua(
            idAgua INTEGER PRIMARY KEY AUTOINCREMENT,
            intervaloAgua INTEGER,
            quantAgua REAL,
            idPerson INTEGER,
            FOREIGN KEY (idPerson) REFERENCES person(idPerson)
        );

        CREATE TABLE IF NOT EXISTS evento(
            idEvento INTEGER PRIMARY KEY AUTOINCREMENT,
            evNome TEXT,
            evData TEXT
        );
        
        CREATE TABLE IF NOT EXISTS remedio(
            idRemedio INTEGER PRIMARY KEY AUTOINCREMENT,
            remdNome TEXT,
            remdQuant INTEGER,
            remdIntervalo INTEGER,
            idPerson INTEGER,
            FOREIGN KEY (idPerson) REFERENCES person(idPerson)
        );

        CREATE TABLE IF NOT EXISTS pet(
            idPet INTEGER PRIMARY KEY AUTOINCREMENT,
            petNomeEvent TEXT,
            petHoraEvent TEXT,
            idPerson INTEGER,
            FOREIGN KEY (idPerson) REFERENCES person(idPerson)
        );

        INSERT INTO person (personPeso, personHSono, personPet)
        SELECT 68, '08:00:00', 1
        WHERE (SELECT COUNT(*) FROM person) = 0;

        INSERT INTO sono (sonoDateIni, sonoDateFim, idPerson)
        SELECT '2024-10-10 00:00:00', '2024-10-10 08:30:00', 1
        WHERE (SELECT COUNT(*) FROM sono) = 0;

        INSERT INTO evento (evNome, evData)
        SELECT 'Festa da Prima', '2024-10-24 12:00:00'
        WHERE (SELECT COUNT(*) FROM evento) <= 3;

        INSERT INTO evento (evNome, evData)
        SELECT 'Festa de Casamento', '2024-10-25 15:00:00'
        WHERE (SELECT COUNT(*) FROM evento) <= 3;

        INSERT INTO evento (evNome, evData)
        SELECT 'Festa de Formatura', '2024-10-15 09:00:00'
        WHERE (SELECT COUNT(*) FROM evento) <= 3;

        INSERT INTO evento (evNome, evData)
        SELECT 'Festa do Pai', '2024-10-10 18:00:00'
        WHERE (SELECT COUNT(*) FROM evento) <= 3;
    `)
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
