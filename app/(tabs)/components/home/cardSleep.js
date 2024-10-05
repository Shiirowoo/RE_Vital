import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
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
        marginLeft: 36,
        fontFamily: "Inter_400Regular"
    }
})

function HorasNecessarias(){
    const db = useSQLiteContext()
    const [ hNec, setHNec ] = useState('')
    useEffect(() => {
        async function setup(){
            const result = await db.getFirstAsync(`
                SELECT
                    STRFTIME('%H:%M', TIME((JULIANDAY(DATETIME(sono.sonoDateFim, '-' || person.personHSono)) - JULIANDAY(sonoDateIni)) * 24 * 60 * 60, 'unixepoch')) AS 'hNec'
                FROM sono 
                    INNER JOIN person 
                        ON sono.idPerson = person.idPerson
            `)
            setHNec(result["hNec"])
        }
        setup()
    })
    return(
        <Text style={styles.txt}> Horas Necessarias: {hNec}</Text>
    )
}

function HorasDormidas(){
    const db = useSQLiteContext()
    const [ hDorm, setHDorm ] = useState('')
    useEffect(() => {
        async function setup(){
            const result = await db.getFirstAsync(`
                SELECT
                    STRFTIME('%H:%M', TIME((JULIANDAY(sonoDateFim) - JULIANDAY(sonoDateIni)) * 24 * 60 * 60, 'unixepoch')) AS 'hDorm'
                FROM sono`)
            setHDorm(result["hDorm"])
        }
        setup()
    })
    return(
        <Text style={styles.txt}> Horas Dormidas: {hDorm}</Text>
    )
}

export default function CardSleep(){ 
    return  (
        <View style={styles.view}>
                <View style={{
                    flexDirection: "row",
                    marginBottom: 6
                }}>
                    <MaterialCommunityIcons name="sleep" size={28} color="white"/>
                    <Text style={{
                        fontSize: 24,
                        color: "#fff",
                        fontWeight: "bold",
                        marginLeft: 12,
                        fontFamily: "Inter_700Bold"
                    }}>Sono</Text>
                </View>
                <HorasDormidas />
                <HorasNecessarias />
        </View>
    )
}