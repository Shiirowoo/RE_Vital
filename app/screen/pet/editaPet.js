import { useSQLiteContext } from "expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput, Text, View, Pressable, StyleSheet, Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function detalheEvento(){
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext();
    const router = useRouter()
    
    const [nome, setNome] = useState('');

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        async function setup() {
            const result = await db.getFirstAsync(`
                SELECT 
                    petNomeEvent AS 'nome',
                    STRFTIME('%H:%M', petHoraEvent) AS 'hora'
                FROM pet
                WHERE idPet = ${id};
            `);
            setNome(result.nome);
            setDate(result.hora);
        }
        setup();
    }, [db]);
    

    function editarEvento(){
        Alert.alert(
            "Atualizar Registro",
            "Você realmente deseja editar esse evento?",
            [
                {text: "Sim", onPress: async() => {
                        const statement = await db.prepareAsync("UPDATE pet SET petNomeEvent = $nome, petHoraEvent = $data WHERE idPet = $id;")
                        try{
                            await statement.executeAsync({$nome: nome, $data: date, $id: id})
                        } finally {
                            await statement.finalizeAsync()
                        }
                    }
                },
                {text: "Não", onPress: async() => {}}
            ]
        )
    }

    function deletaEvento(){
        Alert.alert(
            "Deletar Registro",
            "Você realmente deseja deletar esse evento?",
            [
                {text: "Sim", onPress: async() => {
                    const statement = await db.prepareAsync("DELETE FROM pet WHERE idPet = $id;")
                    try{
                        await statement.executeAsync({$id: id})
                    } finally {
                        await statement.finalizeAsync()
                    }
                    router.back()
                }},
                {text: "Não", onPress: async() => {}}
            ]
        )
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date; 
        setShow(false);
        setDate(currentDate);
    };
    
    return (
        <View>
            <TextInput 
                placeholder={nome}
                style={styles.textInput}
                onChangeText={setNome}
                value={nome}
            />
            <Pressable onPress={async() => setShow(true)} style={styles.dateInput}>
                <MaterialCommunityIcons name="calendar" size={30} color="white" />
                <Text style={styles.txtDate}>{date ? date : new Date()}</Text>
            </Pressable>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode='time'
                    is24Hour={true}
                    onChange={onChange}
                />
            )}
            <Pressable
                onPress={editarEvento}
                style={styles.btnAtt}
            >
                <Text>Atualizar</Text>
            </Pressable>
            <Pressable
                onPress={deletaEvento}
                style={styles.btnDel}
            >
                <Text>Deletar</Text>
            </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    textInput: {
        borderColor: 'darkblue',
        borderWidth: 2,
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginVertical: 20
    },
    registerButton: {
        backgroundColor: '#1d0ce3',
        borderRadius: 25,
        padding: 10,
    },
    registerTxt: {
        fontFamily: 'Inter_500Medium',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    dateInput: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        backgroundColor: "#1d0ce3",
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 20
    },
    txtDate: {
        fontFamily: 'Inter_500Medium',
        fontSize: 20,
        color: 'white',
    },
});