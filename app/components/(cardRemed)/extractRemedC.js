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
        marginHorizontal: 5,
        flexDirection: 'row'
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

export default function ExtractRemedioContinuo(){
    const db = useSQLiteContext();
    const router = useRouter();
    const [remedioC, setRemedioC] = useState([]);

    useEffect(()=> {
        async function setup(){
            const result = await db.getAllAsync(`
            SELECT 
                remedioContinuo.idRemContinuo AS 'ID',
                remedioContinuo.remcNome AS 'Nome',
                STRFTIME('%H:%M', rmcUsos.rmcHorario) AS 'Horario'
            FROM remedioContinuo
                INNER JOIN rmcUsos
                    ON remedioContinuo.idRemContinuo = rmcUsos.idRemContinuo
            WHERE rmcUsos.rmcHorario > TIME('now','-3 hours');
            `);
            setRemedioC(result)
        }
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
      <View>
          {remedioC.map((remedio) => {
            const { Nome, ID, Horario } = remedio
            return(
                <View key={ID} style={styles.caixa}>
                    <Pressable onPress={async() => editaRemedio(ID)}>
                        <Text style={styles.h1}>{Horario}</Text>
                        <Text style={styles.h2}>{Nome}</Text>
                    </Pressable>
                </View>
            )
          })
          }
      </View>
  )
}