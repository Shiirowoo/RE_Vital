import { View, Text, ScrollView, StyleSheet} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

function Evento(){
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
                    fontSize: 30
                    }}>{"12:08"}</Text>
                <Text style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: 18,
                    fontSize: 14
                    }}>{"Evento"}</Text>
            </View>
        </View>
    )
}

function Add(){
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
                    fontSize: 14
                    }}>Adicionar</Text>
            </View>
        </View>
    )
}

export default function CardEvento(){
    return(
        <View style={styles.view}>
            <View style={{
                flexDirection: "row",
                marginBottom: 20,
            }}>
                <AntDesign name="star" size={24} color="white" />
                <Text style={{
                    flexDirection: "row",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 24,
                    marginLeft: 12
                }}>Eventos</Text>
            </View>
            
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Add />
                <Evento />
                <Evento />
                <Evento />
                <Evento />
                <Evento />
            </ScrollView>
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