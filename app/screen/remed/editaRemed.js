import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

export default function editaRemd(){
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const db = useSQLiteContext();

    const [remedio, setRemedio] = useState([])

    useEffect(()=> {
        async function setup(){
            const result = await db.getFirstAsync(`
                SELECT
                    remdNome AS 'nome'
                FROM remedio
                WHERE idRemedio = ${id};
            `)
            setRemedio(result)
        }
        setup()
    })

    const { nome } = remedio
    return (
        <View>
            <TextInput 
            placeholder={nome}
            />
            <TextInput 
            placeholder={nome}
            />
        </View>
    )
}