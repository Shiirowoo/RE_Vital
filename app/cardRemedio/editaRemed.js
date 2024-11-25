import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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

    const atualizarDadosRemed = async() => {
    
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
                    remComeco AS remHorario
                FROM remedio
                WHERE DATETIME(remComeco, 'localtime') > DATETIME('now', 'localtime')
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
    };

    const deletarRemedio = async() => {
        const deletarRemedio = await db.prepareAsync(`
            DELETE FROM remedio
            WHERE idRemedio = $id;
            
            DELETE FROM remHora
            WHERE idRemedio = $id;
        `)
        Alert.alert(
            "Confirmação",
            "Você deseja deletar esse evento?",
            [
                {text: "SIM", onPress: async() => {
                    try{
                        await deletarRemedio.executeAsync({$id: id});
                        Alert.alert(
                            'Sucesso',
                            'Remedio deletado com sucesso',
                            [
                                {text: 'OK', onPress: () => router.back()}
                            ]
                        );
            
                    } finally {
                        deletarRemedio.finalizeAsync();
                    }
                }},
                {text: "NÃO"}
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.modal}>
                <View style={styles.medicamentoInfo}>
                    <Text style={styles.textAuxiliar}>Nome do Rémedio:</Text>
                    <TextInput
                        placeholder="Nome do Remédio"
                        onChangeText={setNome}
                        value={nome || ''}
                        style={styles.textInputNome}
                    />
                    <Text style={styles.textAuxiliar}>Começo do Tratamento:</Text>
                    <Pressable
                        onPress={() => {
                            setIsStartDate(true);
                            setShowDatePicker(true);
                        }}
                        style={styles.boxTime}
                    >
                        <Text style={styles.textResult}>
                            {comeco ? comeco.toLocaleString() : 'Escolha a data'}
                        </Text>
                    </Pressable>
                    <Text style={styles.textAuxiliar}>Final do Tratamento:</Text>
                    <Pressable
                        onPress={() => {
                            setIsStartDate(false);
                            setShowDatePicker(true);
                        }}
                        style={styles.boxTime}
                    >
                        <Text style={styles.textResult}>
                            {final ? final.toLocaleString() : 'Escolha a data'}
                        </Text>
                    </Pressable>
                    {showDatePicker && (
                        <DateTimePicker
                            value={
                                isStartDate ? comeco instanceof Date && !isNaN(comeco)? comeco: new Date() : final instanceof Date && !isNaN(final) ? final : new Date()
                            }
                            mode="date"
                            display="default"
                            onChange={handleConfirmDate}
                        />
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            value={
                                isStartDate? comeco instanceof Date && !isNaN(comeco) ? comeco : new Date() : final instanceof Date && !isNaN(final) ? final : new Date()
                            }
                            mode="time"
                            display="default"
                            onChange={handleConfirmTime}
                        />
                    )}
                    <Text style={styles.textAuxiliar}>Quantidade:</Text>
                    <View style={styles.quantityContainer}>
                        <TextInput
                            placeholder="Quantidade"
                            onChangeText={setQuant}
                            value={String(quant || '')}
                            style={styles.textInputQuant}
                            keyboardType="numeric"
                        />
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={medida}
                                onValueChange={(itemValue) => setMedida(itemValue)}
                            >
                                <Picker.Item label="U" value="U" />
                                <Picker.Item label="ML" value="ML" />
                                <Picker.Item label="Comprimido" value="C" />
                            </Picker>
                        </View>
                    </View>
                    <Text style={styles.textAuxiliar}>Intervalo:</Text>
                    <View style={styles.intervalContainer}>
                        <TextInput
                            onChangeText={setIntervalo}
                            value={String(intervalo || 'HH:MM')}
                            keyboardType="numeric"
                            style={styles.textInputInterv}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={() => deletarRemedio()} style={styles.buttonExc}>
                            <Text style={styles.buttonExcText}>Excluir</Text>
                        </Pressable>
                        <Pressable
                            onPress={async () => atualizarDadosRemed()}
                            style={styles.buttonAtt}
                        >
                            <Text style={styles.buttonAttText}>Atualizar</Text>
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    medicamentoInfo: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },
    textInputNome: {
        padding: 10,
        fontSize: 16,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d4d8de',
    },
    textAuxiliar: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Inter_700Bold',
    },
    boxTime: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#d4d8de',
        marginBottom: 15,
    },
    textResult: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#333',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    textInputQuant: {
        flex: 0.5,
        padding: 13,
        borderRadius: 8,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderWidth: 1,
        borderColor: '#d4d8de',
    },
    picker: {
        flex: 0.50,
        borderRadius: 8,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderWidth: 1,
        borderColor: '#d4d8de',
    },
    intervalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    textInputInterv: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#d4d8de',
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