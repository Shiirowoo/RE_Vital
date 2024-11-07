import { useRouter } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Pet(){
    const db = useSQLiteContext()
    const [evento, setEventos] = useState([])

    useEffect(() => {
        async function setup(){
            const result = await db.getAllAsync(`
                SELECT 
                    idEvento AS 'ID',
                    evData AS 'Data',
                    evNome AS 'Nome' 
                FROM evento
                ORDER BY evData ASC;
            `);
            setEventos(result);
        }
        const interval = setInterval(() => {
            setup()
        }, 200)

        return () => clearInterval(interval)

    }, [])


    const router = useRouter();

    const detalheEvento = (id) => {
        router.push({
            pathname: '/screen/evento/editaEvento',
            params: {
                id: id
            }
        })
    }
    return(
        <View style={{flexDirection: 'row'}}>
            {evento.map((evento) => {
                const data = new Date(evento.Data)
                const dia = data.toLocaleDateString()
                const hora = data.toLocaleTimeString()
                const nome = evento.Nome
                const id = evento["ID"]
                return (
                    <View key={id} style={{marginHorizontal: 6}}>
                            <Pressable
                            style={styles.caixa}
                            onPress={() => detalheEvento(id)}
                            >
                                <View>
                                    <Text style={styles.diaCaixa}>{(dia.replace('-','/')).substring(0, 5)}</Text>
                                </View>
                                <View>
                                    <Text style={styles.horCaixa}>{hora.substring(0, 5)}</Text>
                                </View>
                                <View>
                                    <Text style={styles.txtCaixa}>{nome}</Text>
                                </View>
                            </Pressable>
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