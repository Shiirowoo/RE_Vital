import { View, Text, StyleSheet } from "react-native";
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react'
import { Link } from 'expo-router';

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

export default function Remed(){
    const db = useSQLiteContext()
    const [remedio, setRemedio] = useState()

    useEffect(()=> {
        async function setup(){
            const result = await db.getAllAsync('SELECT * FROM remedio');
            setRemedio(result) 
        }
        setup()
    })

    return(
      <View style={styles.caixa}>
          <View>
              <Text style={styles.h1}>{"14:00"}</Text>
              <Text style={styles.h2}>{"Nome Remedio"}</Text>
          </View>
      </View>
  )
}