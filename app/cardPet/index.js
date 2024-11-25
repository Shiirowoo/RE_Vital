import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter, Link } from 'expo-router';

function Title() {
    return (
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <MaterialIcons name="pets" size={24} color="#000000" />
            <Text style={styles.title}>Pet</Text>
        </View>
    );
}

function Add() {
    return (
        <View style={styles.caixa}>
            <Link href={'./cardPet/registerPet'}>
                <Entypo name="plus" size={58} color="#333333" />
            </Link>
        </View>
    );
}

function Pet({ data: dados }) {
    const router = useRouter();

    return (
        <View style={{ flexDirection: 'row' }}>
            {dados.map((pet, index) => {
                const { hora, nome, id } = pet;
                return (
                    <View key={index}>
                        <Pressable
                            style={styles.caixa}
                            onPress={() => router.push('/cardPet/editaPet?id='+ id +'')}
                        >
                            <View>
                                <Text style={styles.horCaixa}>{hora}</Text>
                            </View>
                            <View>
                                <Text style={styles.txtCaixa}>{nome}</Text>
                            </View>
                        </Pressable>
                    </View>
                );
            })}
        </View>
    );
}

export default function CardPet({ data }) {
    return (
        <View style={styles.card}>
            <Title />
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Add />
                <Pet data={data} />
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    card: {
        margin: 10,
        backgroundColor: "#FFFFFF",
        padding: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        flexDirection: "row",
        color: "#000000",
        fontWeight: "bold",
        fontSize: 24,
        marginLeft: 12,
        fontFamily: "Inter_700Bold"
    },
    caixa:{
        backgroundColor: '#FFF',
        marginRight: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#BDBDBD",
        borderRadius: 25,
        width: 140,
        height: 140,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    diaCaixa: {
        color: "#333333",
        textAlign: "center",
        fontSize: 20,
        fontFamily: "Inter_700Bold"
    },
    horCaixa: {
        color: "#333333",
        textAlign: "center",
        fontSize: 30,
        fontFamily: "Inter_900Black"
    },
    txtCaixa: {
        color: "#333333",
        textAlign: "center",
        fontSize: 12,
        fontFamily: "Inter_700Bold"
    }
});