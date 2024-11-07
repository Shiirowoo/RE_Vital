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
                idRemedio AS 'id',
                remNome AS 'Nome',
                remFinal AS 'Final'
            FROM remedio;
            `);
            setRemedio(result);
            
        };

        const interval = setInterval(() => {
            setup()
        }, 200)

        return () => clearInterval(interval)
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
      <View style={{flexDirection: 'row'}}>
          {remedio.map((remedio) => {
            const { Nome, id, Final } = remedio
            return(
                <View key={id} style={styles.caixa}>
                    <Pressable onPress={async() => editaRemedio(id)}>
                        <Text style={styles.h2}>{Final}</Text>
                        <Text style={styles.h2}>{Nome}</Text>
                    </Pressable>
                </View>
            )
          })}
      </View>
  )
}