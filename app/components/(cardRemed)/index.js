import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, ScrollView } from "react-native";

import Add from './addRemed';
import Remed from './extractRemed'
import ExtractRemedioContinuo from './extractRemedC';
import ExtractRemedio from './extractRemed';

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

export default function CardRemed(){
    return (
        <View style={styles.view}>
            <View style={{
                flexDirection: "row",
                marginBottom: 6
            }}>
                <MaterialCommunityIcons name="pill" size={24} color="white" />
                <Text style={{
                fontSize: 24,
                color: "#fff",
                fontWeight: "bold",
                marginLeft: 12,
                fontFamily: "Inter_700Bold"
                }}>Rémedios</Text>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Add />
                <ExtractRemedioContinuo />
                <ExtractRemedio />
            </ScrollView>
        </View>
    )
}
