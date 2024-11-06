import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
    caixa: {
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 25,
        backgroundColor: "#1d0ce3",
        width: 140,
        height: 140,
        marginHorizontal: 5
    },
    h1: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 45,
        fontSize: 30,
        fontFamily: "Inter_900Black"
    },
    h2: {
        color: "white",
        textAlign: "center",
        marginTop: 18,
        fontSize: 14,
        fontFamily: "Inter_700Bold"
    }
})

export default function ExtractRemedio(){
    const db = useSQLiteContext();
    const router = useRouter();
    const [remedio, setRemedio] = useState([])

    useEffect(()=> {
        async function setup(){
            const result = await db.getAllAsync(`
            SELECT 
                remNome AS 'nome',
                idRemedio AS 'id'
            FROM remedio;
            `);
            setRemedio(result) 
        }
        setup()
    })

    const editaRemedio = (id) => {
        router.push({
            pathname: '/screen/remed/editaRemed',
            params: {
                id: id
            }
        })
    }

    return(
      <View>
          {remedio.map((remedio) => {
            const { nome, id } = remedio
            const hora = "14:00"
            return(
                <View key={id} style={styles.caixa}>
                    <Pressable onPress={async() => editaRemedio(id)}>
                        <Text style={styles.h1}>{hora}</Text>
                        <Text style={styles.h2}>{nome}</Text>
                    </Pressable>
                </View>
            )
          })
          }
      </View>
  )
}