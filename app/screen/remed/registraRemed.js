import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import RemedioContinuo from './regRemedioC';
import Remedio from './regRemedio';

export default function registraRemed(){
    const [alterna, setAlterna] = useState(false);

    return (
        <View>
            <View>
                <Pressable onPress={async() => setAlterna(false)}>
                    <Text>Tratamento Normal</Text>
                </Pressable>
                <Pressable onPress={async() => setAlterna(true)}>
                    <Text>Tratamento Continuo</Text>
                </Pressable>
            </View>
            <AlternaTratamento change={alterna}/>
        </View>
    )
}

function AlternaTratamento({change: Enable}){
    if (Enable){
        return (
            <RemedioContinuo />
        )
    }
    return (
        <Remedio />
    )
}