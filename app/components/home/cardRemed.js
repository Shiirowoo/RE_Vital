import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';

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

function Add(){
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_900Black
      });
    
      if (!fontsLoaded) {
        return null;
      }
    return(
        <View style={{
            borderWidth: 5,
            borderColor: "white",
            borderRadius: 25,
            backgroundColor: "#1d0ce3",
            width: 140,
            height: 140,
            marginHorizontal: 5
        }}>
            <View>
            <Entypo name="plus" size={48} color="white" style={{
                alignSelf: "center",
                marginTop: 37
            }}/>
                <Text style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: 18,
                    fontSize: 14,
                    fontFamily: "Inter_700Bold"
                    }}>Adicionar</Text>
            </View>
        </View>
    )
}
function Remed(){
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_900Black
      });
    
      if (!fontsLoaded) {
        return null;
      }
      return(
        <View style={{
            borderWidth: 5,
            borderColor: "white",
            borderRadius: 25,
            backgroundColor: "#1d0ce3",
            width: 140,
            height: 140,
            marginHorizontal: 5
        }}>
            <View>
                <Text style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: 45,
                    fontSize: 30,
                    fontFamily: "Inter_900Black"
                    }}>{"14:00"}</Text>
                <Text style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: 18,
                    fontSize: 14,
                    fontFamily: "Inter_700Bold"
                    }}>{"Nome Remedio"}</Text>
            </View>
        </View>
    )
}



export default function CardRemed(){
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold
      });
    
      if (!fontsLoaded) {
        return null;
      }

    return  (
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
                <Remed />
            </ScrollView>
        </View>
    )
}
