import { View, StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function IconView(){
    return(
        <View style={styles.iconview}>
            <View style={styles.iconborder}>
                <MaterialCommunityIcons name="power-sleep" size={120} color="#1d0ce3"/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    iconview: {
        height: 200,
        alignItems:"center",
        justifyContent: "center"
    },
    iconborder:  {
        borderColor: "#1d0ce3",
        borderWidth: 12,
        borderRadius: 100,
        padding: 20,
        paddingLeft: 28
    },
}) 