import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter, Link } from 'expo-router';

const styles = StyleSheet.create({
    card: {
        margin: 10,
        backgroundColor: "#2710f2",
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
    },
    caixa: {
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 25,
        width: 140,
        height: 140,
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: 5
    },
    diaCaixa: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
        fontFamily: "Inter_700Bold"
    },
    horCaixa: {
        color: "white",
        textAlign: "center",
        fontSize: 30,
        fontFamily: "Inter_900Black"
    },
    txtCaixa: {
        color: "white",
        textAlign: "center",
        fontSize: 12,
        fontFamily: "Inter_700Bold"
    }
});

function Title() {
    return (
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <MaterialIcons name="pets" size={24} color="white" />
            <Text style={styles.title}>Pet</Text>
        </View>
    );
}

function Add() {
    return (
        <View style={styles.caixa}>
            <Link href={'./screen/evento/registerEvento'}>
                <Entypo name="plus" size={58} color="white" />
            </Link>
        </View>
    );
}

function Pet({ data: dados }) {
    const router = useRouter();

    const detalhePet = (id) => {
        router.push({
            pathname: '/screen/pet/editaPet',
            params: {
                id: id
            }
        });
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            {dados.map((pet, index) => {
                const { hora, nome, id } = pet;
                return (
                    <View key={index} style={{ marginHorizontal: 6 }}>
                        <Pressable
                            style={styles.caixa}
                            onPress={() => detalhePet(id)}
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