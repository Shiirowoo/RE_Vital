import { View, Text, ScrollView, StyleSheet} from "react-native";
import { Link } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

const styles = StyleSheet.create({
    view: {
        margin: 10,
        backgroundColor: "#1d0ce3",
        padding: 12,
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 15,
    },
    txt: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "400",
        marginLeft: 36
    },
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
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
        fontFamily: "Inter_900Black"
    },
    horCaixa: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30,
        fontFamily: "Inter_900Black"
    },
    txtCaixa: {
        color: "white",
        textAlign: "center",
        fontSize: 14,
        fontFamily: "Inter_700Bold"
    }
})

function Evento(){
    const db = useSQLiteContext()
    const [evento, setEventos] = useState([])
  
    useEffect(() => {
        async function setup(){
            const result = await db.getAllAsync(`
                SELECT 
                    idEvento AS 'ID',
                    REPLACE(STRFTIME('%d-%m', evData), '-', '/') AS 'Dia',
                    STRFTIME('%H:%M',evData) AS 'Hora',
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

function Add(){
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_900Black
      });
    
      if (!fontsLoaded) {
        return null;
      }
    return(
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 5,
            borderColor: "white",
            borderRadius: 25,
            backgroundColor: "#1d0ce3",
            width: 140,
            height: 140,
            }}>
                <Link href={""}>
                    <Entypo name="plus" size={58} color="white"/>
                </Link>
        </View>           
    )
}

export default function CardEvento(){
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_900Black
      });
    
      if (!fontsLoaded) {
        return null;
      }
    return(
        <View style={styles.view}>
            <View style={{
                flexDirection: "row",
                marginBottom: 20,
            }}>
                <AntDesign name="star" size={24} color="white" />
                <Text style={{
                    flexDirection: "row",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 24,
                    marginLeft: 12,
                    fontFamily: "Inter_700Bold"
                }}>Eventos</Text>
            </View>
            
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Add />
                <Evento />
            </ScrollView>
        </View>
    )
}