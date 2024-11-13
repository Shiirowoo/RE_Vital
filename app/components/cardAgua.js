import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const styles = StyleSheet.create({
    card: {
        margin: 10,
        backgroundColor: "#2710f2",
        padding: 12,
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 15,
    },
    button: {
        borderRadius: 100,
        backgroundColor: '#fffeff',
        borderWidth: 2,
        borderColor: 'cyan',
        paddingHorizontal: 45,
        paddingVertical: 40
    },
    title:{
        fontSize: 24,
        color: "#fffeff",
        fontWeight: "bold",
        marginLeft: 12,
        fontFamily: "Inter_700Bold"
    },
    topico: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "400",
        marginLeft: 36,
        fontFamily: "Inter_400Regular"
    }
})

function Title(){
    return(
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <Ionicons name="water" size={28} color="white"/>
            <Text style={styles.title}>Água</Text>
        </View>
    );
};

function BotaoRegisterAgua(){
    return(
        <Pressable style={styles.button}>
            <FontAwesome6 name="glass-water" size={40} color="#2710f2" />
        </Pressable>
    );
};

export default function CardWater(){
    return (
        <View style={styles.card}>
            <Title />
            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <BotaoRegisterAgua />
                <View>
                    <Text style={styles.topico}>Ingerido: {100} ML</Text>
                    <Text style={styles.topico}>Necessário: {2000} ML</Text>
                </View>
            </View>
        </View>
    );
};