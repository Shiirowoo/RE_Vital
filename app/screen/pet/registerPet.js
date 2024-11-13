import { View, TextInput, StyleSheet, Text, Pressable, Alert } from 'react-native'
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function screenRegisterEvento(){
    const router = useRouter();
    const db = useSQLiteContext();

    const [nome, setNome] = useState('');

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const registrarEvento = async() => {
        const statement = await db.prepareAsync("INSERT INTO pet (petNomeEvent, petHoraEvent) VALUES ($nome, $data)")
        
        const statementVerify = await db.prepareAsync("SELECT COUNT(*) FROM pet WHERE petNomeEvent = $nome")
        const verify = await statementVerify.executeAsync({$nome: nome})
        const eventExist = await verify.getFirstAsync()

        if (eventExist["COUNT(*)"] > 0){
            Alert.alert(
                "Erro",
                "O seu Evento já está cadastrado",
                [
                    {text: "OK", onPress: async() => {}},
                    {text: "Voltar", onPress: async() => {
                        const router = useRouter()
                        router.back()
                    }}
                ]
            )
            return
        }
        try {
            await statement.executeAsync({$nome: nome, $data: date})
        }
        finally {
            await statement.finalizeAsync()
        }
        
        Alert.alert(
            "Sucesso",
            "O seu Evento foi Cadastrado com sucesso",
            [
                {text: "Voltar", onPress: () => {
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
                <Pressable onPress={async() => setShow(true)} style={styles.dateInput}>
                    <MaterialCommunityIcons name="calendar" size={30} color="white" />
                    <Text style={styles.txtDate}>{date ? date.toLocaleTimeString() : new Date()}</Text>
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
            </View>
            <View>
                <Pressable style={styles.registerButton} onPress={registrarEvento}>
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