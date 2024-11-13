import { View, Text, Pressable, StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

const styles = StyleSheet.create({
    card: {
        margin: 10,
        backgroundColor: "#2710f2",
        padding: 12,
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 15,
    },
    button: {
        borderRadius: 100,
        backgroundColor: '#fffeff',
        borderWidth: 2,
        borderColor: 'cyan',
        paddingHorizontal: 42,
        paddingVertical: 40
    },
    title:{
        fontSize: 24,
        color: "#fffeff",
        fontWeight: "bold",
        marginLeft: 12,
        fontFamily: "Inter_700Bold"
    },
    topico: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "400",
        marginLeft: 36,
        fontFamily: "Inter_400Regular"
    }
});

function Title(){
    return(
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <MaterialCommunityIcons name="sleep" size={28} color="white"/>
            <Text style={styles.title}>Sono</Text>
        </View>
    );
};

function BotaoRegisterSono(){
    return(
        <Pressable style={styles.button}>
            <MaterialCommunityIcons name="bell-sleep-outline" size={40} color="#2710f2" />
        </Pressable>
    );
};

export default function CardSleep(){ 
    return  (
        <View style={styles.card}>
            <Title />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <BotaoRegisterSono />
                <View>
                    <Text style={styles.topico}>Dormiu: {10} H</Text>
                    <Text style={styles.topico}>Necessario: {10} H</Text>
                </View>
            </View>
        </View>
    );
};