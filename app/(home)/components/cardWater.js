import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet } from "react-native";

export default function CardWater(){
    return  (
        <View style={styles.view}>
            <View style={{
                flexDirection: "row",
                marginBottom: 6
            }}>
                <Ionicons name="water" size={28} color="white"/>
                <Text style={{
                fontSize: 24,
                color: "#fff",
                fontWeight: "bold",
                marginLeft: 12
                }}>Água</Text>
            </View>
                <Text style={styles.txt}> Água Ingerida: {100} ML</Text>
                <Text style={styles.txt}> Quantidade Necessária: {2000} ML</Text>
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