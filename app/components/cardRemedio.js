import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Link, useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

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
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 12,
        fontFamily: "Inter_700Bold"
    },
    caixa: {
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 25,
        width: 140,
        height: 140,
        marginHorizontal: 5
    },
    h1: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 45,
        fontSize: 30,
        fontFamily: "Inter_900Black"
    },
    h2: {
        color: "white",
        textAlign: "center",
        marginTop: 18,
        fontSize: 14,
        fontFamily: "Inter_700Bold"
    }
});

function Title() {
    return (
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <MaterialCommunityIcons name="pill" size={24} color="white" />
            <Text style={styles.title}>Remédios</Text>
        </View>
    );
}

function Add() {
    return (
        <View style={styles.caixa}>
            <Link href={'./screen/remed/registraRemed'}>
                <Entypo name="plus" size={58} color="white" />
            </Link>
        </View>
    );
}

function ExtractRemedioContinuo({ data: dadosRC }) {
    const router = useRouter();

    const editaRemedio = (id) => {
        router.push({
            pathname: '/screen/remed/editaRemedC',
            params: {
                id: id
            }
        });
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            {dadosRC.map((remedio) => {
                const { Nome, ID, horario } = remedio;
                return (
                    <View key={ID} style={styles.caixa}>
                        <Pressable onPress={() => editaRemedio(ID)}>
                            <Text style={styles.h1}>{Horario}</Text>
                            <Text style={styles.h2}>{Nome}</Text>
                        </Pressable>
                    </View>
                );
            })}
        </View>
    );
}

function ExtractRemedio({ data: dadosR }) {
    const router = useRouter();

    const editaRemedio = (id) => {
        router.push({
            pathname: '/screen/remed/editaRemed',
            params: {
                id: id
            }
        });
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            {dadosR.map((remedio) => {
                const { nome, id, final } = remedio;
                return (
                    <View key={id} style={styles.caixa}>
                        <Pressable onPress={() => editaRemedio(id)}>
                            <Text style={styles.h2}>{final}</Text>
                            <Text style={styles.h2}>{nome}</Text>
                        </Pressable>
                    </View>
                );
            })}
        </View>
    );
}

export default function CardRemed({ dataR: dadosR, dataRC: dadosRC }) {
    return (
        <View style={styles.card}>
            <Title />
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Add />
                <ExtractRemedioContinuo data={dadosRC} />
                <ExtractRemedio data={dadosR} />
            </ScrollView>
        </View>
    );
}
