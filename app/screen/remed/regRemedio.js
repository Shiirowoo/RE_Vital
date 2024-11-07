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
    const [final, setFinal] = useState(null);
    const [comeco, setComeco] = useState(null);

    const [startDate, setStartDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isStartDate, setIsStartDate] = useState(true);

    const handleConfirmDate = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            if (isStartDate) {
                setComeco(date); // Define a data inicial
                setShowTimePicker(true); // Mostra o seletor de tempo
            } else {
                setFinal(date); // Define a data final
                setShowTimePicker(true);
            }
        }
    };

    const handleConfirmTime = (event, time) => {
        setShowTimePicker(false);
        if (time) {
            const selectedDateTime = isStartDate
                ? new Date(comeco.setHours(time.getHours(), time.getMinutes()))
                : new Date(final.setHours(time.getHours(), time.getMinutes()));

            if (isStartDate) {
                setStartDate(selectedDateTime);
            } else {
                setFinal(selectedDateTime);
            }
        }
    };

    const enviarDados = async() => {
        const registrarRemedio = await db.prepareAsync(`
            INSERT INTO remedio (remNome, remQuant, remMedida, remComeco, remIntervaloDoses, remFinal)
            SELECT $nome, $quant, $medida, $comeco, $intervalo, $final
            WHERE (SELECT COUNT(*) FROM remedio WHERE remNome = $nome) = 0;
        `);
        const registrarHorarios = await db.prepareAsync(`
            WITH RECURSIVE horarios AS (
            SELECT
                idRemedio,
                remComeco AS 'remHorario'
            FROM remedio

            UNION ALL

            SELECT
                r.idRemedio,
                DATETIME(h.remHorario, '+' || r.remIntervaloDoses || ' hour') AS 'remHorario'
            FROM horarios h
            JOIN remedio r ON h.idRemedio = r.idRemedio
            WHERE DATETIME(h.remHorario, '+' || r.remIntervaloDoses || ' hour') <= r.remFinal
        )
        INSERT INTO remHora (idRemedio, remHorario)
        SELECT idRemedio, remHorario
        FROM horarios;
        `);

        try {
            await registrarRemedio.executeAsync({
                $nome: nome,
                $quant: quant,
                $medida: medida,
                $comeco: comeco.toISOString(),
                $intervalo: intervalo,
                $final: final.toISOString()
            });
            await registrarHorarios.executeAsync()
            
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
        <Pressable
        onPress={() => {
            setIsStartDate(true);
            setShowDatePicker(true);
        }}
        style={{}}
        >
            <Text style={{}}>{comeco ? comeco.toLocaleString() : 'Começo Tratamento'}</Text>
        </Pressable>
        <Pressable
        onPress={() => {
            setIsStartDate(false);
            setShowDatePicker(true);
        }}
        style={{}}
        >
            <Text style={{}}>{final ? final.toLocaleString() : 'Final Tratamento'}</Text>
        </Pressable>
        {showDatePicker && (
                <DateTimePicker
                    value={isStartDate ? (comeco || new Date()) : (final || new Date())}
                    mode="date"
                    display="default"
                    onChange={handleConfirmDate}
                />
        )}

        {showTimePicker && (
                <DateTimePicker
                    value={isStartDate ? (comeco || new Date()) : (final || new Date())}
                    mode="time"
                    display="default"
                    onChange={handleConfirmTime}
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