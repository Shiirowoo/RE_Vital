import { useSQLiteContext } from "expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput, Text, View, Pressable, StyleSheet, Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function detalheEvento(){
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext();
    const router = useRouter();
    
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
            setDate(dataFetched);
        }
        setup();
    }, [id, db]);
    

    function editarEvento(){
        if (nome == ''){
			Alert.alert(
				'Dados Incorretos',
				'Por Favor preencha todos os dados',
                [
                    {text: 'OK'}
                ]
			)

			return
		}
        Alert.alert(
            "Atualizar Registro",
            "Você deseja atualizar esse evento?",
            [
                {text: "SIM", onPress: async() => {
                        const statement = await db.prepareAsync("UPDATE evento SET evNome = $nome, evData = $data WHERE idEvento = $id")
                        try{
                            await statement.executeAsync({$nome: nome, $data: date.toISOString(), $id: id})
                            Alert.alert(
                                'Sucesso',
                                'Seu evento foi realizado com sucesso',
                                [
                                    {text: 'OK', onPress: () => router.back()}
                                ]
                            )
                        } finally {
                            await statement.finalizeAsync()
                        }
                    }
                },
                {text: "NÃO"}
            ]
        )
    }

    function deletaEvento(){
        Alert.alert(
            "Confirmação",
            "Você deseja deletar esse evento?",
            [
                {text: "SIM", onPress: async() => {
                    const statement = await db.prepareAsync("DELETE FROM evento WHERE idEvento = $id")
                    try{
                        await statement.executeAsync({$id: id})
                        Alert.alert(
                            'Sucesso',
                            'Evento deletado com sucesso',
                            [
                                {text: 'OK', onPress: () => router.back()}
                            ]
                        );
                    } finally {
                        await statement.finalizeAsync()
                    }
                }},
                {text: "NÃO"}
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
    
    return (
        <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
                <TextInput
                    placeholder={nome}
                    style={styles.textInput}
                    onChangeText={setNome}
                    value={nome}
                />
                <Pressable onPress={showDatepicker} style={styles.dateInput}>
                    <MaterialCommunityIcons name="calendar" size={30} color="white" />
                    <Text style={styles.txtDate}>{date.toLocaleDateString() || 'Escolha a Data'}</Text>
                </Pressable>
                <Pressable onPress={showTimepicker} style={styles.dateInput}>
                    <MaterialCommunityIcons name="clock-outline" size={30} color="white" />
                    <Text style={styles.txtDate}>{date ? date.toLocaleTimeString().substring(0, 5) : 'Escolha a Hora'}</Text>
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
                <View style={styles.buttonContainer}>
                    <Pressable onPress={editarEvento} style={styles.btnAtt}>
                        <Text style={styles.btnText}>Atualizar</Text>
                    </Pressable>
                    <Pressable onPress={deletaEvento} style={styles.btnDel}>
                        <Text style={styles.btnText}>Excluir</Text>
                    </Pressable>
                </View>
                <Pressable onPress={() => router.back()} style={styles.btnCancel}>
                    <Text style={styles.textCancel}>Cancelar</Text>
                </Pressable>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textInput: {
        borderColor: '#111',
        borderWidth: 2,
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        fontSize: 18,
        marginVertical: 15,
        color: '#333',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#111',
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 20,
    },
    txtDate: {
        fontFamily: 'Inter_500Medium',
        fontSize: 18,
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    btnAtt: {
        flex: 1,
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10,
    },
    btnDel: {
        flex: 1,
        backgroundColor: '#e74c3c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 10,
    },
    btnCancel: {
        backgroundColor: '#d3d3d3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnText: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
        color: '#fff',
    },
    textCancel: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
});