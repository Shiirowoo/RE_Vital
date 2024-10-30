import { View, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

const styles = StyleSheet.create({
    caixa: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 25,
        backgroundColor: "#1d0ce3",
        width: 140,
        height: 140,
    }
})

export default function Add(){
    return(
        <View style={styles.caixa}>
            <Link href={'./screen/evento/registerEvento'}>
                <Entypo name="plus" size={58} color="white"/>
            </Link>
        </View>           
    )
}