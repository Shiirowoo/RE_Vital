import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Link } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";

export default function Evento(){
    const db = useSQLiteContext()
    const [evento, setEventos] = useState([])
  
    useEffect(() => {
        async function setup(){
            const result = await db.getAllAsync(`
                SELECT 
                    idEvento AS 'ID',
                    SUBSTR(evData, 1, 5) AS 'Dia',
                    SUBSTR(evData, 12, 5) AS 'Hora',
                    evNome AS 'Nome' 
                FROM evento
                ORDER BY evData ASC;
            `);
            setEventos(result);
        }
        setup()
    }, [])

    return(
        <View style={{flexDirection: 'row'}}>
            {evento.map((evento, index) => {
                const dia = evento.Dia
                const hora = evento.Hora
                const nome = evento.Nome
                const id = evento["ID"]
                return (
                    <View key={index} style={{marginHorizontal: 6}}>
                        <Link href={"../../(tabs)/agua"}>
                            <View style={styles.caixa}>
                                <View>
                                    <Text style={styles.diaCaixa}>{dia}</Text>
                                </View>
                                <View>
                                    <Text style={styles.horCaixa}>{hora}</Text>
                                </View>
                                <View>
                                    <Text style={styles.txtCaixa}>{nome}</Text>
                                </View>
                            </View>
                        </Link>
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    caixa: {
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 25,
        backgroundColor: "#1d0ce3",
        width: 140,
        height: 140,
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: 5
    },
    diaCaixa: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
        fontFamily: "Inter_700Bold"
    },
    horCaixa: {
        color: "white",
        textAlign: "center",
        fontSize: 30,
        fontFamily: "Inter_900Black"
    },
    txtCaixa: {
        color: "white",
        textAlign: "center",
        fontSize: 12,
        fontFamily: "Inter_700Bold"
    }
})