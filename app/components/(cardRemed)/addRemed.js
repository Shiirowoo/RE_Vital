import { View, Text, StyleSheet } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { Link } from 'expo-router';

const styles = StyleSheet.create({
    caixa: {
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 25,
        backgroundColor: "#1d0ce3",
        width: 140,
        height: 140,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default function Add(){
    return (
        <View style={styles.caixa}>
            <Link href={'./screen/remed/registraRemed'}>
                <Entypo name="plus" size={58} color="white" />
            </Link>
        </View>
    )
};