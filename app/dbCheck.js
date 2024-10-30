import * as SQLite from "expo-sqlite";

export default async function dbCheck(){
    const db = await SQLite.openDatabaseAsync('test1.db')

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
        SELECT '10/10/2024 00:00:00', '10/10/2024 08:30:00', 1
        WHERE (SELECT COUNT(*) FROM sono) = 0;
    `)
}