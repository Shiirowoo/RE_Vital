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
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        async function setup() {
            const result = await db.getFirstAsync(`
                SELECT
                    evNome AS 'Nome',
                    evData AS 'Data'
                FROM evento
                WHERE idEvento = ${id}
            `);
            setNome(result.Nome);
            const dataFetched = new Date(result.Data);
            setDate(dataFetched); // Atualiza também o estado da data
        }
        setup();
    }, [id, db]);
    

    function editarEvento(){
        Alert.alert(
            "Atualizar Registro",
            "Você realmente deseja editar esse evento?",
            [
                {text: "Sim", onPress: async() => {
                        const statement = await db.prepareAsync("UPDATE evento SET evNome = $nome, evData = $data WHERE idEvento = $id")
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
                    const statement = await db.prepareAsync("DELETE FROM evento WHERE idEvento = $id")
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
    
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    
    const showDatepicker = () => {
        showMode('date');
    };
    
    const showTimepicker = () => {
        showMode('time');
    };
    
    let dia = date.toLocaleDateString();
    let hora = date.toLocaleTimeString();
    
    return (
        <View>
            <TextInput 
                placeholder={nome}
                style={styles.textInput}
                onChangeText={setNome}
                value={nome}
            />
            <Pressable onPress={showDatepicker} style={styles.dateInput}>
                <MaterialCommunityIcons name="calendar" size={30} color="white" />
                <Text style={styles.txtDate}>{dia}</Text>
            </Pressable>
            <Pressable onPress={showTimepicker} style={styles.dateInput}>
                <MaterialCommunityIcons name="calendar" size={30} color="white" />
                <Text style={styles.txtDate}>{hora.substring(0, 5)}</Text>
            </Pressable>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
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