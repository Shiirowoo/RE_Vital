import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";

import RegisterPerson from "./registerPerson";
import CardWater from "./cardAgua";
import CardEvento from './cardEvento';
import CardSleep from "./cardSono";
import CardRemed from "./cardRemedio";
import CardPet from "./cardPet";
import CardFunction from "./cardFunction";

//Link Azul: https://paletadecores.com/paleta/2710f2/1d0ce3/1308d3/0a04c4/0000b4/
//Link Branco: https://paletadecores.com/paleta/fffeff/efeeef/e0dee0/d0cfd0/c0bfc0/

export default function index(){
    const db = useSQLiteContext();
    const [eventos, setEventos] = useState([]);
    const [remedio, setRemedio] = useState([]);
    const [remedioCont, setRemedioCont] = useState([]);
    const [pet, setPet] = useState([]);
    const [person, setPerson] = useState();

    useEffect(() => {
        async function setup(){
            const eventoResult = await db.getAllAsync(`
                SELECT 
                    idEvento AS 'id',
                    STRFTIME('%d/%m', evData, 'localtime') AS 'dia',
                    STRFTIME('%H:%M', evData, 'localtime') AS 'hora',
                    evNome AS 'nome'
                FROM evento
                ORDER BY evData ASC;
            `);
            
            const remedioResult = await db.getAllAsync(`
                SELECT
                    r.idRemedio AS 'id',
                    r.remNome AS 'nome',
                    STRFTIME('%d/%m', MIN(h.remHorario)) AS 'final',
                    STRFTIME('%H:%M', MIN(h.remHorario)) AS 'hora'
                FROM remedio r
                    INNER JOIN remHora h
                        ON r.idRemedio = h.idRemedio
                WHERE DATETIME(h.remHorario) >= DATETIME('now','localtime')
                GROUP BY r.remNome;
            `);

            const remedioContResult = await db.getAllAsync(`
                SELECT 
                    rc.idRemContinuo AS 'id',
                    rc.remcNome AS 'nome',
                    STRFTIME('%H:%M', MIN(s.rmcHorario), 'localtime') AS 'horario'
                FROM remedioContinuo rc
                    INNER JOIN rmcUsos s
                        ON rc.idRemContinuo = s.idRemContinuo
                WHERE TIME(s.rmcHorario, 'localtime') > TIME('now','localtime')
                GROUP BY rc.remcNome;
            `);

            const petResult = await db.getAllAsync(`
                SELECT 
                    idPet AS 'id',
                    petNomeEvent AS 'nome',
                    STRFTIME('%H:%M', petHoraEvent, 'localtime') AS 'hora' 
                FROM pet
                ORDER BY petHoraEvent ASC;
            `);
            
            const personResult = await db.getFirstAsync(`
                SELECT COUNT(*)
                FROM person
            `);

            const result = await db.getAllAsync(`
                SELECT
                    r.idRemedio AS 'id',
                    r.remNome AS 'nome',
                    MIN(h.remHorario) AS 'final',
                    MIN(h.remHorario) AS 'hora'
                FROM remedio r
                    INNER JOIN remHora h
                        ON r.idRemedio = h.idRemedio
                WHERE r.idRemedio = 36
                GROUP BY r.remNome;
            `);
            //console.log(result)
            
            if (JSON.stringify(eventos) !== JSON.stringify(eventoResult)) {
                setEventos(eventoResult);
            }

            if (JSON.stringify(remedio) !== JSON.stringify(remedioResult)) {
                setRemedio(remedioResult);
            }

            if (JSON.stringify(remedioCont) !== JSON.stringify(remedioContResult)) {
                setRemedioCont(remedioContResult);
            }

            if (JSON.stringify(pet) !== JSON.stringify(petResult)) {
                setPet(petResult);
            }

            if (person !== personResult['COUNT(*)']) {
                setPerson(personResult['COUNT(*)']);
            }
            
        };

        const interval = setInterval(() => {
            setup();
        }, 200);
    
        return () => clearInterval(interval);

    }, [db, person, eventos, remedio, remedioCont, pet]);

    if(person == 0){
        return (
            <SafeAreaView>
                <RegisterPerson />
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView>
            <ScrollView>
                <CardFunction />
                <CardSleep />
                <CardWater />
                <CardEvento data={eventos}/>
                <CardRemed dataR={remedio} dataRC={remedioCont}/>
                <CardPet data={pet}/>
            </ScrollView>
        </SafeAreaView>
    );
};
