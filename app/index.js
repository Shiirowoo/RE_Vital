import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";

import CardWater from "./components/cardAgua";
import CardEvento from './components/cardEvento';
import CardSleep from "./components/cardSono";
import CardRemed from "./components/cardRemedio";
import CardPet from "./components/cardPet";

//Link Azul: https://paletadecores.com/paleta/2710f2/1d0ce3/1308d3/0a04c4/0000b4/
//Link Branco: https://paletadecores.com/paleta/fffeff/efeeef/e0dee0/d0cfd0/c0bfc0/
export default function index(){
    const db = useSQLiteContext();
    const [eventos, setEventos] = useState([]);
    const [remedio, setRemedio] = useState([]);
    const [remedioCont, setRemedioCont] = useState([]);
    const [pet, setPet] = useState([]);

    useEffect(() => {
        async function setup(){
            const eventoResult = await db.getAllAsync(`
                SELECT 
                    idEvento AS 'id',
                    STRFTIME('%d/%m', evData) AS 'dia',
                    STRFTIME('%H:%M', evData) AS 'hora',
                    evNome AS 'nome'
                FROM evento
                ORDER BY evData ASC;
            `);

            const remedioResult = await db.getAllAsync(`
                SELECT
                    idRemedio AS 'id',
                    remNome AS 'nome',
                    STRFTIME('%d/%m', remFinal) AS 'final'
                FROM remedio;
            `);

            const remedioContResult = await db.getAllAsync(`
                SELECT 
                    rc.idRemContinuo AS 'ID',
                    rc.remcNome AS 'Nome',
                    STRFTIME('%H:%M', MIN(s.rmcHorario)) AS 'Horario'
                FROM remedioContinuo rc
                    INNER JOIN rmcUsos s
                        ON rc.idRemContinuo = s.idRemContinuo
                WHERE s.rmcHorario > TIME('now','localtime') OR s.rmcHorario >= '00:00'
                GROUP BY rc.remcNome;
            `);

            const petResult = await db.getAllAsync(`
                SELECT 
                    idPet AS 'id',
                    petNomeEvent AS 'nome',
                    STRFTIME('%H:%M', petHoraEvent) AS 'hora' 
                FROM pet
                ORDER BY petHoraEvent;
            `);

            setEventos(eventoResult);
            setRemedio(remedioResult);
            setRemedioCont(remedioContResult);
            setPet(petResult);
        };

        
        const interval = setInterval(() => {
            setup()
        }, 200)
        
        return () => clearInterval(interval)

    }, [db]);
    
    return (
        <SafeAreaView>
            <ScrollView>
                <CardSleep />
                <CardWater />
                <CardEvento data={eventos}/>
                <CardRemed dataR={remedio} dataRC={remedioCont}/>
                <CardPet data={pet}/>
            </ScrollView>
        </SafeAreaView>
    );
};
