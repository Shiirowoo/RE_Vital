import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';

import atualizarDadosRemed from './atualizaRemed';

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
            
            const { nomeR, quantR, medidaR, intervaloR, comecoR, finalR } = result;

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

    const dados = {
        nome: nome,
        quant: quant,
        medida: medida,
        comeco: comeco.toISOString(),
        intervalo: intervalo,
        final: final.toISOString(),
        id: id
    }

    return (
        <SafeAreaView style={{paddingHorizontal: 20}}>
            <View>
                <View style={styles.medicamentoInfo}>
                    <TextInput 
                    placeholder='Nome do Remedio'
                    onChangeText={setNome}
                    value={nome || ''}
                    style={styles.textInputNome}
                    />
                    <Text style={styles.textAuxiliar}>Começo Tratamento: </Text>
                    <Pressable
                    onPress={() => {
                        setIsStartDate(true);
                        setShowDatePicker(true);
                    }}
                    style={styles.boxTime}
                    >
                        <Text style={styles.textResult}>{comeco ? (comeco.toLocaleString()) : ''}</Text>
                    </Pressable>
                    <Text style={styles.textAuxiliar}>Final Tratamento: </Text>
                    <Pressable
                    onPress={() => {
                        setIsStartDate(false);
                        setShowDatePicker(true);
                    }}
                    style={styles.boxTime}
                    >
                        <Text style={styles.textResult}>{final ? (final.toLocaleString()) : ''}</Text>
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
                    <Text style={styles.textAuxiliar}>Quantidade: </Text>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput 
                        placeholder='Quantidade'
                        onChangeText={setQuant}
                        value={String(quant || '')}
                        style={styles.textInputQuant}
                        keyboardType='numeric'
                        />
                        <View style={styles.picker}>
                            <Picker
                            selectedValue={medida}
                            onValueChange={(itemValue) => setMedida(itemValue)}
                            >
                                <Picker.Item label='U' value='U' style={styles.textResult}/>
                                <Picker.Item label='ML' value='ML' style={styles.textResult}/>
                                <Picker.Item label='Comprimido' value='C' style={styles.textResult}/>
                            </Picker>
                        </View>
                    </View>
                    <Text style={styles.textAuxiliar}>Intervalo: </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput 
                        placeholder='Intervalo de Doses'
                        onChangeText={setIntervalo}
                        value={String(intervalo || '')}
                        keyboardType='numeric'
                        style={styles.textInputInterv}
                        />
                        <Text style={styles.textAuxiliar}>Horas</Text>
                    </View>
                </View>
                <Pressable
                onPress={deletarRemedio}
                style={styles.buttonExc}
                >
                    <Ionicons name="trash" size={26} color="#fffeff" />
                    <Text style={styles.buttonExcText}>Excluir</Text>
                </Pressable>
                <Pressable
                onPress={async() => atualizarDadosRemed(dados)}
                style={styles.buttonAtt}
                >
                    <FontAwesome5 name="sync" size={26} color="#fffeff" />
                    <Text style={styles.buttonAttText}>Atualizar</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    medicamentoInfo: {
        backgroundColor: '#2710f2',
        padding: 10,
        borderRadius: 2,
    },
    box: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        marginTop: 3,
        marginBottom: 10
    },
    textInputNome: {
        backgroundColor: '#fffeff',
        padding: 5,
        fontSize: 18,
        borderRadius: 5,
        marginBottom: 15
    },
    textAuxiliar: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Inter_700Bold'
    },
    boxTime: {
        backgroundColor: '#fffeff',
        height: 50,
        borderRadius: 5,
        marginVertical: 3,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textResult: {
        fontSize: 18,
        fontFamily: 'Inter_500Medium',
        textAlign: 'center'
    },
    textInputQuant: {
        fontSize: 18,
        fontFamily: 'Inter_500Medium',
        backgroundColor: '#fffeff',
        paddingLeft: 10,
        marginVertical: 5,
        width: '65%',
        height: 50,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5
    },
    textInputInterv: {
        fontSize: 18,
        fontFamily: 'Inter_500Medium',
        backgroundColor: '#fffeff',
        paddingLeft: 10,
        marginVertical: 5,
        width: '65%',
        height: 50,
        borderRadius: 5,
        marginRight: 10
    },
    picker: {
        backgroundColor: '#fffeff',
        width: '35%',
        height: 50,
        marginVertical: 5,
        borderColor: 'black',
        borderLeftWidth: 1, 
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5
    },
    add: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 10,
        marginVertical: 10
    },
    buttonAtt: {
        backgroundColor: '#2710f2',
        padding: 20,
        marginBottom: 10,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonAttText: {
        color: '#fffeff',
        marginLeft: 3,
        fontSize: 18,
        fontFamily: 'Inter_900Black'
    },
    buttonExc: {
        backgroundColor: '#e01515',
        padding: 20,
        marginTop: 80,
        marginBottom: 10,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonExcText: {
        color: '#fffeff',
        marginLeft: 5,
        fontSize: 18,
        fontFamily: 'Inter_900Black'
    }
});