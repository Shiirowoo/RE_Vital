import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';

export default function Remedio(){
    const db = useSQLiteContext();
    const router = useRouter();

    const [nome, setNome] = useState('')
    const [quant, setQuant] = useState('');
    const [medida, setMedida] = useState('');
    const [intervalo, setIntervalo] = useState('');

    const [final, setFinal] = useState(new Date());
    const [comeco, setComeco] = useState(new Date());
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        if (mode == 'time'){
            setFinal(currentDate);
        }
        setComeco(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const enviarDados = async() => {
        const registrarRemedio = await db.prepareAsync(`
            INSERT INTO remedio (remNome, remQuant, remMedida, remComeco, remIntervaloDoses, remFinal)
            SELECT $nome, $quant, $medida, $comeco, $intervalo, $final
            WHERE (SELECT COUNT(*) FROM remedio WHERE remNome = $nome) = 0;
        `);

        try {
            await registrarRemedio.executeAsync({
                $nome: nome,
                $quant: quant,
                $medida: medida,
                $comeco: comeco,
                $intervalo: intervalo,
                $final: final
            });
            Alert.alert(
                'Sucesso',
                'Remedio registrado com sucesso',
                [
                    {text: 'Voltar', onPress: () => {
                        router.back()
                    }}
                ]
            );
        } finally {
            registrarRemedio.finalizeAsync()
        }
    }

    return(
        <View>
        <TextInput 
        placeholder='Nome do Remedio'
        onChangeText={setNome}
        value={nome || ''}
        style={{}}
        />
        <Pressable onPress={showTimepicker} style={{}}>
            <Text style={{}}>{'A partir de: '+comeco.toLocaleDateTimeString()}</Text>
        </Pressable>
        {show && (
            <DateTimePicker
            testID="dateTimePicker"
            value={comeco}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            />
        )}
        <Pressable onPress={showDatepicker} style={{}}>
            <Text style={{}}>{'Até: '+ final.toLocaleDateString()}</Text>
        </Pressable>
        {show && (
            <DateTimePicker
            testID="dateTimePicker"
            value={final}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            />
        )}
        <View>
            <TextInput 
            placeholder='Quantidade'
            onChangeText={setQuant}
            value={quant || ''}
            style={{}}
            />
            <Picker
            selectedValue={medida}
            onValueChange={(itemValue) => setMedida(itemValue)}
            >
                <Picker.Item label='U' value='U'/>
                <Picker.Item label='ML' value='ML'/>
                <Picker.Item label='Comprimido' value='C'/>
            </Picker>
        </View>
        <View>
            <TextInput 
            placeholder='Intervalo de Doses'
            onChangeText={setIntervalo}
            value={intervalo || ''}
            style={{}}
            />
            <Text>Horas</Text>
        </View>
        <Pressable
        onPress={enviarDados}
        style={{}}
        >
            <Text> Registrar </Text>
        </Pressable>
    </View>
    )
}