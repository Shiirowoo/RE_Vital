import { View, TextInput, StyleSheet, Text, Pressable, Alert } from 'react-native'
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterPet(){
    const router = useRouter();
    const db = useSQLiteContext();

    const [nome, setNome] = useState('');

    const [date, setDate] = useState(new Date());
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
        const statement = await db.prepareAsync("INSERT INTO pet (petNomeEvent, petHoraEvent) VALUES ($nome, $data)")
        
        const statementVerify = await db.prepareAsync("SELECT COUNT(*) FROM pet WHERE petNomeEvent = $nome")
        const verify = await statementVerify.executeAsync({$nome: nome})
        const eventExist = await verify.getFirstAsync()

        if (eventExist["COUNT(*)"] > 0){
            Alert.alert(
                "Erro",
                "O seu Evento de Pet já está cadastrado",
                [
                    {text: "OK"}
                ]
            )
            return
        }
        try {
            await statement.executeAsync({$nome: nome, $data: date.toISOString()})
            Alert.alert(
                "Sucesso",
                "O seu Evento de Pet foi cadastrado com sucesso",
                [
                    {text: "OK", onPress: () => router.back()}
                ]
            )
        }
        finally {
            await statement.finalizeAsync()
        }
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    return (
        <SafeAreaView style={styles.modal}>
            <View style={styles.content}>
                <Text style={styles.textAuxiliar}>Nome do Evento:</Text>
                <TextInput 
                    style={styles.textInput}
                    onChangeText={setNome}
                    value={nome}
                />
                <Text style={styles.textAuxiliar}>Hora do Evento:</Text>
                <Pressable onPress={async() => setShow(true)} style={styles.dateInput}>
                    <MaterialCommunityIcons name="calendar" size={30} color="white" />
                    <Text style={styles.txtDate}>{date ? date.toLocaleTimeString().substring(0,5) : new Date()}</Text>
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
                <Pressable style={styles.buttonReg} onPress={registrarEvento}>
                    <Text style={styles.buttonRegText}>Registrar</Text>
                </Pressable>
                <Pressable
                onPress={() => router.back()}
                style={styles.buttonClose}
                >
                    <Text style={styles.buttonCloseText}> Cancelar </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

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
    buttonReg: {
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
    buttonRegText: {
        color: '#ffffff',
        marginLeft: 5,
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    buttonClose: {
        backgroundColor: '#d3d3d3',
        padding: 15,
        marginTop: 5,
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