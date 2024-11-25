import { View, Text, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

function Title() {
    return (
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <Ionicons name="water" size={28} color="#000000" />
            <Text style={styles.title}>Água</Text>
        </View>
    );
}

export default function CardWater() {
    const db = useSQLiteContext();
    const [agua, setAgua] = useState([])

    useEffect(() => {
        async function setup(){
            const result = await db.getFirstAsync(`
                SELECT
                    a.aguaQuant AS 'quant',
                    (p.personPeso * 30) AS 'necess',
                    a.aguaData AS 'data'
                FROM agua a
                    INNER JOIN person p
                        ON p.idPerson = a.idPerson
                WHERE STRFTIME('%d-%m-%Y', a.aguaData) = STRFTIME('%d-%m-%Y', DATETIME('now', 'localtime'));
            `)
            
            setAgua(result)
        }

        const interval = setInterval(() => {
            setup()
		}, 2000);

		return () => clearInterval(interval);

    }, [])

    const { quant, necess } = agua

    return (
        <View style={styles.card}>
            <Title />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View>
                    <Text style={styles.topico}>Ingerido: {quant} ML</Text>
                    <Text style={styles.topico}>Necessário: {necess} ML</Text>
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
    button: {
        borderRadius: 50,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#BDBDBD',
        paddingHorizontal: 45,
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: "#000000",
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