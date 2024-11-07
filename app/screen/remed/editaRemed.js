import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

export default function editaRemd(){
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const db = useSQLiteContext();

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

    useEffect(()=> {
        async function setup(){
            const result = await db.getFirstAsync(`
                SELECT
                    remNome AS 'nomeR',
                    remQuant AS 'quantR',
                    remMedida AS 'medidaR',
                    remIntervaloDoses AS 'intervaloR',
                    STRFTIME('%d/%m/%Y %H:%M', DATETIME(remComeco, 'localtime')) AS 'comecoR',
                    STRFTIME('%d/%m/%Y %H:%M', DATETIME(remFinal, 'localtime')) AS 'finalR'
                FROM remedio
                WHERE idRemedio = ${id};
            `);
            
            const { nomeR, quantR, medidaR, intervaloR, comecoR, finalR} = result;

            setNome(nomeR);
            setQuant(quantR);
            setMedida(medidaR);
            setIntervalo(intervaloR);
            setComeco(comecoR);
            setFinal(finalR);
            
        };
        setup();
    },[db])

    const handleConfirmDate = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            if (isStartDate) {
                setComeco(date);
                setShowTimePicker(true);
            } else {
                setFinal(date);
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

    const deletarRemedio = async() => {
        const deletarRemedio = await db.prepareAsync(`
            DELETE FROM remedio
            WHERE idRemedio = $id;
            
            DELETE FROM remHora
            WHERE idRemedio = $id;
        `)

        try{
            await deletarRemedio.executeAsync({$id: id});
            Alert.alert(
                'Sucesso',
                'Remedio deletado com sucesso',
                [
                    {text: 'Voltar', onPress: () => {
                        router.back()
                    }}
                ]
            );

        } finally {
            deletarRemedio.finalizeAsync();
        }
    }

    const atualizarDados = async() => {
        const atualizarRemedio = await db.prepareAsync(`
            UPDATE remedio
            SET remNome = $nome, remQuant = $quant, remMedida = $medida, remComeco = $comeco, remIntervaloDoses = $intervalo, remFinal = $final
            WHERE idRemedio = $id;
        `);

        const deletarHorariosAntigos = await db.prepareAsync(`
            DELETE FROM remHora
            WHERE idRemedio = $id;
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
        SELECT $id, remHorario
        FROM horarios;
        `);

        try {
            await atualizarRemedio.executeAsync({
                $nome: nome,
                $quant: quant,
                $medida: medida,
                $comeco: comeco.toISOString(),
                $intervalo: intervalo,
                $final: final.toISOString(),
                $id: id
            });
            await deletarHorariosAntigos.executeAsync({$id: id});
            await registrarHorarios.executeAsync({$id: id});
            
            Alert.alert(
                'Sucesso',
                'Remedio atualizado com sucesso',
                [
                    {text: 'Voltar', onPress: () => {
                        router.back()
                    }}
                ]
            );
        } finally {
            atualizarRemedio.finalizeAsync();
            deletarHorariosAntigos.finalizeAsync();
            registrarHorarios.finalizeAsync();
        }
    }

    return (
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
            <Text style={{}}>{comeco ? (comeco.toLocaleString()) : 'Começo Tratamento'}</Text>
        </Pressable>
        <Pressable
        onPress={() => {
            setIsStartDate(false);
            setShowDatePicker(true);
        }}
        style={{}}
        >
            <Text style={{}}>{final ? (final.toLocaleString()) : 'Final Tratamento'}</Text>
        </Pressable>
        {showDatePicker && (
            <DateTimePicker
                value={isStartDate ? (comeco instanceof Date && !isNaN(comeco) ? comeco : new Date()) : (final instanceof Date && !isNaN(final) ? final : new Date())}
                mode="date"
                display="default"
                onChange={handleConfirmDate}
            />
        )}

        {showTimePicker && (
            <DateTimePicker
                value={isStartDate ? (comeco instanceof Date && !isNaN(comeco) ? comeco : new Date()) : (final instanceof Date && !isNaN(final) ? final : new Date())}
                mode="time"
                display="default"
                onChange={handleConfirmTime}
            />
        )}

        <View>
            <TextInput 
            placeholder='Quantidade'
            onChangeText={setQuant}
            value={String(quant || '')}
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
            value={String(intervalo || '')}
            style={{}}
            />
            <Text>Horas</Text>
        </View>
        <Pressable
        onPress={atualizarDados}
        style={{}}
        >
            <Text> Atualizar </Text>
        </Pressable>
        <Pressable
        onPress={deletarRemedio}
        style={{}}
        >
            <Text> Excluir </Text>
        </Pressable>
    </View>
    )
}