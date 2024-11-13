import * as SQLite from "expo-sqlite";

export default async function dbCheck(){
    const db = await SQLite.openDatabaseAsync('memory')

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
            remNome TEXT,
            remQuant INTEGER,
            remMedida TEXT,
            remComeco TEXT,
            remIntervaloDoses INTEGER,
            remFinal INTEGER
        );

        CREATE TABLE IF NOT EXISTS remHora(
            idRemedio INTEGER,
            remHorario TEXT,
            FOREIGN KEY (idRemedio) REFERENCES remedio(idRemedio)
        );

        CREATE TABLE IF NOT EXISTS remedioContinuo(
            idRemContinuo INTEGER PRIMARY KEY AUTOINCREMENT,
            remcNome TEXT
        );

        CREATE TABLE IF NOT EXISTS rmcUsos(
            idUsos INTEGER PRIMARY KEY AUTOINCREMENT,
            idRemContinuo INTEGER,
            rmcHorario TEXT,
            rmcQuant FLOAT,
            rmcMedida TEXT,
            FOREIGN KEY (idRemContinuo) REFERENCES remedioContinuo(idRemContinuo)
        );

        CREATE TABLE IF NOT EXISTS pet(
            idPet INTEGER PRIMARY KEY AUTOINCREMENT,
            petNomeEvent TEXT,
            petHoraEvent TEXT
        );

        INSERT INTO person (personPeso, personHSono, personPet)
        SELECT 68, '08:00:00', 1
        WHERE (SELECT COUNT(*) FROM person) = 0;

        INSERT INTO sono (sonoDateIni, sonoDateFim, idPerson)
        SELECT '10/10/2024 00:00:00', '10/10/2024 08:30:00', 1
        WHERE (SELECT COUNT(*) FROM sono) = 0;

        INSERT INTO pet (petNomeEvent, petHoraEvent)
        SELECT * FROM (
            SELECT 'Banheiro' AS petNomeEvent, '07:00:00' AS petHoraEvent
            UNION ALL
            SELECT 'Comida', '07:00:00'
            UNION ALL
            SELECT 'Agua', '07:00:00'
        ) AS pet_eventos
        WHERE (SELECT COUNT(*) FROM pet) = 0;
    `)
}