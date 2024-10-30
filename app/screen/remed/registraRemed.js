import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';

export default function registraRemed(){
    const db = useSQLiteContext()
    const router = useRouter()
    const [nome, setNome] = useState()
    const [quant, setQuant] = useState()

    const enviarDados = async() => {
        const statement = await db.prepareAsync(`INSERT INTO remedio ( remdNome, remdQuant) VALUES ($nome, $quant)`)
        try {
            await statement.executeAsync({$nome: nome, $quant: quant})
            Alert.alert(
                'Sucesso',
                'Remedio registrado com sucesso',
                [
                    {text: 'Voltar', onPress: () => {
                        router.back()
                    }}
                ]
            )
        } finally {
            await statement.finalizeAsync()
        }
    }
    

    return (
        <View>
            <TextInput 
            placeholder='Nome do Remedio'
            onChangeText={setNome}
            value={nome}
            style={{}}
            />
            <TextInput 
            placeholder='Quantidade'
            onChangeText={setQuant}
            value={quant}
            style={{}}
            />
            <Pressable onPress={enviarDados}>
                <Text> Registrar </Text>
            </Pressable>
        </View>
    )
}