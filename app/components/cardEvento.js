import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Link, useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: "white",
        borderRadius: 25,
        width: 140,
        height: 140,
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
        <View style={{
            flexDirection: "row",
            marginBottom: 20
        }}>
            <AntDesign name="star" size={24} color="white" />
            <Text style={styles.title}>Eventos</Text>
        </View>
    );
}

function Evento({ data: dados }) {
    const router = useRouter();

    const detalheEvento = (id) => {
        router.push({
            pathname: '/screen/evento/editaEvento',
            params: {
                id: id
            }
        });
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            {dados.map((evento) => {
                const { id, nome, hora, dia } = evento;
                return (
                    <View key={id} style={{ marginHorizontal: 6 }}>
                        <Pressable
                            style={styles.caixa}
                            onPress={() => detalheEvento(id)}
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
            <Link href={'./screen/evento/registerEvento'}>
                <Entypo name="plus" size={58} color="white" />
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