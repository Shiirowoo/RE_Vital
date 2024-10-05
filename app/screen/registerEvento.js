import { View, TextInput, StyleSheet, Text, Pressable, Alert } from 'react-native'
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function screenRegisterEvento(){
    const db = useSQLiteContext()
    const [nome, setNome] = useState('')
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const registrarEvento = async(dados) => {
        const statement = await db.prepareAsync("INSERT INTO evento (evNome, evData) VALUES ($nome, $data)")
        
        const statementVerify = await db.prepareAsync("SELECT COUNT(*) FROM evento WHERE evNome = $nome")
        const verify = await statementVerify.executeAsync({$nome: dados.nome})
        const eventExist = await verify.getFirstAsync()

        if (eventExist["COUNT(*)"] > 0){
            Alert.alert(
                "Erro",
                "O seu Evento já está cadastrado",
                [
                    {text: "OK", onPress: async() => {}},
                    {text: "Voltar", onPress: async() => {}}
                ]
            )
            return
        }
        try {
            await statement.executeAsync({$nome: dados.nome, $data: dados.data})
        }
        finally {
            await statement.finalizeAsync()
        }
        Alert.alert(
            "Sucesso",
            "O seu Evento foi Cadastrado com sucesso",
            [
                {text: "OK", onPress: async() => {}},
                {text: "Voltar", onPress: async() => {}}
            ]
        )
        const results = await db.getAllAsync("SELECT * FROM evento")

        for (const row of results) {
           console.log(row.idEvento, row.evNome, row.evData);
        }
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

    const dados = {
        nome: nome,
        data: date.toLocaleString(),
    }
    return (
        <View style={{
            padding: 20,
            flex: 1,
            justifyContent: 'space-between',
        }}>
            <View>
                <TextInput 
                    placeholder={'Nome do Evento'}
                    style={styles.textInput}
                    onChangeText={setNome}
                    value={nome}
                />
                <Pressable onPress={showDatepicker} style={styles.dateInput}>
                    <MaterialCommunityIcons name="calendar" size={30} color="white" />
                    <Text style={styles.txtDate}>{dateShow}</Text>
                </Pressable>
                <Pressable onPress={showTimepicker} style={styles.dateInput}>
                    <MaterialCommunityIcons name="calendar" size={30} color="white" />
                    <Text style={styles.txtDate}>{hour}</Text>
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
            </View>
            <View>
                <Pressable style={styles.registerButton} onPress={async() => registrarEvento(dados)}>
                    <Text style={styles.registerTxt}>Registrar</Text>
                </Pressable>
            </View>
        </View>
    )
}

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