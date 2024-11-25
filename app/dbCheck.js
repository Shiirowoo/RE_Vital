import * as SQLite from "expo-sqlite";

export default async function dbCheck(){
    const db = await SQLite.openDatabaseAsync('revital.db')

    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_key = ON;

        CREATE TABLE IF NOT EXISTS person(
            idPerson INTEGER PRIMARY KEY AUTOINCREMENT,
            personPeso REAL,
            personHSono TEXT,
            personPet INTEGER,
            personIntervaloAgua INTEGER,
            personTrabalhoInicio TEXT,
            personTrabalhoFim TEXT
        );

        CREATE TABLE IF NOT EXISTS sono(
            idSono INTEGER PRIMARY KEY AUTOINCREMENT,
            idPerson INTEGER,
            sonoDateIni TEXT,
            sonoDateFim TEXT,
            FOREIGN KEY (idPerson) REFERENCES person(idPerson)
        );

        CREATE TABLE IF NOT EXISTS agua(
            idAgua INTEGER PRIMARY KEY AUTOINCREMENT,
            idPerson INTEGER,
            aguaQuant INTEGER,
            aguaData TEXT,
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

        INSERT INTO pet (petNomeEvent, petHoraEvent)
        SELECT * FROM (
            SELECT 'Banheiro' AS petNomeEvent, '07:00:00' AS petHoraEvent
            UNION ALL
            SELECT 'Comida', '07:00:00'
            UNION ALL
            SELECT 'Agua', '07:00:00'
        ) AS pet_eventos
        WHERE (SELECT COUNT(*) FROM pet) = 0;

        INSERT INTO agua (aguaQuant, aguaData, idPerson)
        SELECT 0, DATETIME('now', 'localtime'), 1
        WHERE NOT EXISTS (
            SELECT 1
            FROM agua
            WHERE STRFTIME('%d-%m-%Y', aguaData) = STRFTIME('%d-%m-%Y', DATETIME('now', 'localtime'))
        );
    `)
}