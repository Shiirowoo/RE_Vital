import { View, TextInput, StyleSheet, Text, Pressable, Alert } from 'react-native'
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function RegisterEvento(){
    const router = useRouter()
    const db = useSQLiteContext()
    const [nome, setNome] = useState('')
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const registrarEvento = async() => {
        if(nome == ''){
            Alert.alert(
				'Dados Incorretos',
				'Por Favor preencha todos os dados',
                [
                    {text: 'OK'}
                ]
			)

            return
        }

        const statement = await db.prepareAsync("INSERT INTO evento (evNome, evData) VALUES ($nome, $data)")
        const eventExist = await db.getFirstAsync(`
            SELECT COUNT(*)
            FROM evento
            WHERE evNome = '${nome}'
        `)
        
        if (eventExist["COUNT(*)"] > 0){
            Alert.alert(
                "Erro",
                "O seu Evento já está cadastrado",
                [
                    {text: "OK"}
                ]
            )

            return
        }

        try {
            await statement.executeAsync({ $nome: nome, $data: date.toISOString() })
        }
        finally {
            await statement.finalizeAsync()
        }
        
        Alert.alert(
            "Sucesso",
            "O seu Evento foi Cadastrado com sucesso",
            [
                {text: "OK", onPress: () => {
                    router.back()
                }}
            ]
        )
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
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
    const dateShow = (date.toLocaleString()).split(' ')[0]
    const hour = ((date.toLocaleString()).split(' ')[1]).split(':')[0] + ':' + ((date.toLocaleString()).split(' ')[1]).split(':')[1]
    
    return (
        <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Novo Evento</Text>
                    <View>
                        <TextInput
                            placeholder="Nome do Evento"
                            style={styles.textInput}
                            onChangeText={setNome}
                            value={nome}
                        />
                        <Pressable onPress={showDatepicker} style={styles.dateInput}>
                            <MaterialCommunityIcons name="calendar" size={30} color="white" />
                            <Text style={styles.txtDate}>{dateShow || 'Escolha a Data'}</Text>
                        </Pressable>
                        <Pressable onPress={showTimepicker} style={styles.dateInput}>
                            <MaterialCommunityIcons name="clock-outline" size={30} color="white" />
                            <Text style={styles.txtDate}>{hour || 'Escolha o Horário'}</Text>
                        </Pressable>
                        {show && (
                            <DateTimePicker
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                            />
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.registerButton} onPress={registrarEvento}>
                            <Text style={styles.registerTxt}>Registrar</Text>
                        </Pressable>
                        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                            <Text style={styles.cancelTxt}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'Inter_700Bold',
        color: '#111',
        marginBottom: 20,
        textAlign: 'center',
    },
    textInput: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#d3d3d3',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
        fontFamily: 'Inter_500Medium',
        color: '#333333',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    txtDate: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#ffffff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    registerButton: {
        flex: 1,
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10,
    },
    registerTxt: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
        color: '#ffffff',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#d3d3d3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 10,
    },
    cancelTxt: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
        color: '#333333',
    },
});