import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Link, useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';


function Title() {
    return (
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <MaterialCommunityIcons name="pill" size={24} color="#000000" />
            <Text style={styles.title}>Remédios</Text>
        </View>
    );
}

function Add() {
    return (
        <View style={styles.caixa}>
            <Link href={'./cardRemedio/registraRemed'}>
                <Entypo name="plus" size={58} color="#000000" />
            </Link>
        </View>
    );
}

function ExtractRemedioContinuo({ data: dadosRC }) {
    const router = useRouter();

    return (
        <View style={{ flexDirection: 'row' }}>
            {dadosRC.map((remedio) => {
                const { nome, id, horario } = remedio;
                return (
                    <View key={id} style={styles.caixa}>
                        <Pressable onPress={() => router.push('/cardRemedio/editaRemedC?id='+ id + '')}>
                            <Text style={styles.h1}>{horario}</Text>
                            <Text style={styles.h2}>{nome}</Text>
                        </Pressable>
                    </View>
                );
            })}
        </View>
    );
}

function ExtractRemedio({ data: dadosR }) {
    const router = useRouter();

    return (
        <View style={{ flexDirection: 'row' }}>
            {dadosR.map((remedio) => {
                const { nome, id, final, hora } = remedio;
                return (
                    <View key={id} style={styles.caixa}>
                        <Pressable onPress={() => router.push('/cardRemedio/editaRemed?id='+ id + '')}>
                            <Text style={styles.h2}>{final}</Text>
                            <Text style={styles.h1}>{hora}</Text>
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
        fontSize: 24,
        color: "#000000",
        fontWeight: "bold",
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
    h1: {
        color: "#333333",
        textAlign: "center",
        fontSize: 30,
        fontFamily: "Inter_900Black"
    },
    h2: {
        color: "#333333",
        textAlign: "center",
        marginTop: 18,
        fontSize: 14,
        fontFamily: "Inter_700Bold"
    }
});