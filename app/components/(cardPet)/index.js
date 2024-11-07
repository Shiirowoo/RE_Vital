import { View, Text, ScrollView, StyleSheet} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Add from "./addPet";
import Pet from "./extractPet";

export default function CardPet(){
    return(
        <View style={styles.view}>
            <Title />
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Add />
                <Pet />
            </ScrollView>
        </View>
    )
}

function Title(){
    return (
        <View style={{
            flexDirection: "row",
            marginBottom: 20
        }}>
            <AntDesign name="star" size={24} color="white" />
            <Text style={styles.title}>Pet</Text>
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
    title: {
        flexDirection: "row",
        color: "white",
        fontWeight: "bold",
        fontSize: 24,
        marginLeft: 12,
        fontFamily: "Inter_700Bold"
    }
})