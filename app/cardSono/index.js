import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

function Title() {
    return (
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <MaterialCommunityIcons name="sleep" size={28} color="#000000" />
            <Text style={styles.title}>Sono</Text>
        </View>
    );
};

export default function CardSleep() {
    const db = useSQLiteContext();
    const router = useRouter();

    const [sono, setSono] = useState('');
    const [desejado, setDesejado] = useState('')

    useEffect(() => {
        async function setup() {
            const resultSono = await db.getFirstAsync(`
                SELECT
                    CAST((JULIANDAY(sonoDateIni) - JULIANDAY(sonoDateFim)) * 24 AS INTEGER) AS 'dormido'
                FROM sono
                WHERE STRFTIME('%d-%m-%Y', DATETIME(sonoDateFim, 'localtime')) = STRFTIME('%d-%m-%Y', DATETIME('now', 'localtime'));
            `)
            const resultDesejado = await db.getFirstAsync(`
                SELECT
                    personHSono AS 'necess'
                FROM person;
            `)
            
            setSono(resultSono == null ? {dormido: 0}.dormido : resultSono.dormido)
            setDesejado(resultDesejado.necess)
        }

        const interval = setInterval(() => {
            setup()
		}, 2000);

        return () => clearInterval(interval);
    }, [sono])
    
    return  (
        <View style={styles.card}>
            <Title />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View>
                    <Text style={styles.topico}>Dormiu: {String(sono)[1] || String(sono)} H</Text>
                    <Text style={styles.topico}>Necessário: {desejado} H</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        backgroundColor: "#FFFFFF",
        padding: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        color: "#000000",
        fontWeight: "bold",
        marginLeft: 12,
        fontFamily: "Inter_700Bold",
    },
    topico: {
        fontSize: 18,
        color: "#333333",
        fontWeight: "400",
        marginLeft: 36,
        fontFamily: "Inter_500Medium",
    },
});