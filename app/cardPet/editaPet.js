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
    const [hora, setHora] = useState('')

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        async function setup() {
            const result = await db.getFirstAsync(`
                SELECT 
                    petNomeEvent AS 'nome',
                    DATETIME(petHoraEvent, 'localtime') AS 'hora'
                FROM pet
                WHERE idPet = ${id};
            `);
            setNome(result.nome);
            
            setHora(new Date(result.hora));
        }
        setup();
    }, [db]);
    

    function editarEvento(){
        Alert.alert(
            "Atualizar Registro",
            "Você realmente deseja editar esse evento?",
            [
                {text: "SIM", onPress: async() => {
                        const statement = await db.prepareAsync("UPDATE pet SET petNomeEvent = $nome, petHoraEvent = $data WHERE idPet = $id;")
                        try{
                            await statement.executeAsync({$nome: nome, $data: date.toISOString(), $id: id})
                            Alert.alert(
                                "Sucesso",
                                "O seu Evento de Pet foi atualizado com sucesso",
                                [
                                    {text: "OK", onPress: () => router.back()}
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
            "Deletar Registro",
            "Você realmente deseja deletar esse evento?",
            [
                {text: "SIM", onPress: async() => {
                    const statement = await db.prepareAsync("DELETE FROM pet WHERE idPet = $id;")
                    try{
                        await statement.executeAsync({$id: id})
                        Alert.alert(
                            "Sucesso",
                            "O seu Evento de Pet foi excluido com sucesso",
                            [
                                {text: "OK", onPress: () => router.back()}
                            ]
                        )
                    } finally {
                        await statement.finalizeAsync()
                    }
                    router.back()
                }},
                {text: "NÃO", onPress: async() => {}}
            ]
        )
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate
        setShow(false);
        setDate(currentDate);
        setHora(currentDate)
    };
    
    return (
        <View style={styles.modal}>
            <View style={styles.content}>
                <Text style={styles.textAuxiliar}>Nome do Evento</Text>
                <TextInput 
                    placeholder={nome}
                    style={styles.textInput}
                    onChangeText={setNome}
                    value={nome}
                />
                <Text style={styles.textAuxiliar}>Hora do Evento</Text>
                <Pressable onPress={async() => setShow(true)} style={styles.dateInput}>
                    <MaterialCommunityIcons name="clock" size={30} color="white" />
                    <Text style={styles.txtDate}>{hora ? hora.toLocaleTimeString().substring(0,5) : new Date().toLocaleTimeString().substring(0,5)}</Text>
                </Pressable>
                {show && (
                    <DateTimePicker
                        value={date}
                        mode='time'
                        is24Hour={true}
                        onChange={onChange}
                    />
                )}
                <View style={styles.buttonContainer}>
                    <Pressable
                        onPress={editarEvento}
                        style={styles.buttonAtt}
                    >
                        <Text style={styles.buttonAttText}>Atualizar</Text>
                    </Pressable>
                    <Pressable
                        onPress={deletaEvento}
                        style={styles.buttonExc}
                    >
                        <Text style={styles.buttonExcText}>Excluir</Text>
                    </Pressable>
                </View>
                <Pressable
                onPress={() => router.back()}
                style={styles.buttonClose}
                >
                    <Text style={styles.buttonCloseText}> Cancelar </Text>
                </Pressable>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    content: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    textAuxiliar: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#444444',
        marginBottom: 5,
    },
    textInput: {
        borderColor: '#d3d3d3',
        borderWidth: 2,
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginVertical: 20
    },
    dateInput: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        backgroundColor: "#000",
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 20
    },
    txtDate: {
        fontFamily: 'Inter_500Medium',
        fontSize: 20,
        color: '#FFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    buttonAtt: {
        flex: 1,
        backgroundColor: '#111',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonAttText: {
        color: '#ffffff',
        marginLeft: 5,
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    buttonExc: {
        flex: 1,
        backgroundColor: '#c00',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonExcText: {
        color: '#ffffff',
        marginLeft: 5,
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    buttonClose: {
        backgroundColor: '#d3d3d3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonCloseText: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
});