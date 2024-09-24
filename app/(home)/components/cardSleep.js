import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
                        marginLeft: 12
                    }}>Sono</Text>
                </View>
                <Text style={styles.txt}> Horas Dormidas: {12}:{"32"}</Text>
                <Text style={styles.txt}> Horas Necessárias: {8}:{"02"}</Text>
        </View>
    )
}

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
    }
})