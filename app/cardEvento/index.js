import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Link, useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

function Title() {
    return (
        <View style={{
            flexDirection: "row",
            marginBottom: 20
        }}>
            <AntDesign name="star" size={24} color="#000000" />
            <Text style={styles.title}>Eventos</Text>
        </View>
    );
}

function Evento({ data: dados }) {
    const router = useRouter();

    return (
        <View style={{ flexDirection: 'row' }}>
            {dados.map((evento) => {
                const { id, nome, hora, dia } = evento;
                return (
                    <View key={id}>
                        <Pressable
                            style={styles.caixa}
                            onPress={() => router.push('/cardEvento/editaEvento?id='+ id +'')}
                        >
                            <View>
                                <Text style={styles.diaCaixa}>{dia}</Text>
                            </View>
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

function Add() {
    return (
        <View style={styles.caixa}>
            <Link href='/cardEvento/registerEvento'>
                <Entypo name="plus" size={58} color="#000000" />
            </Link>
        </View>
    );
}

export default function CardEvento({ data: dados }) {
    return (
        <View style={styles.card}>
            <Title />
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Add />
                <Evento data={dados} />
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