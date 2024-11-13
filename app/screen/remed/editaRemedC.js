import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { View, Text, TextInput, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import atualizarDadosRemedC from './atualizaRemedC';

export default function editaRemd(){
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext();
    const router = useRouter();

    const [nome, setNome] = useState('');
    const [idUsos, setIdUsos] = useState([]);
    const [horario, setHorario] = useState([]);
    const [quant, setQuant] = useState([]);
    const [medida, setMedida] = useState([]);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        handleHorario(currentIndex, selectedDate.toLocaleTimeString());
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showTimepicker = (index) => {
        setCurrentIndex(index);
        showMode('time');
    };

    const handleQuant = (index, value) => {
        const updatedQuant = [...quant];
        updatedQuant[index] = value;
        setQuant(updatedQuant);
    };

    const handleHorario = (index, value) => {
        const updatedHorario = [...horario];
        updatedHorario[index] = value;
        setHorario(updatedHorario);
    };

    const handleMedida = (index, value) => {
        const updatedMedida = [...medida];
        updatedMedida[index] = value;
        setMedida(updatedMedida);
    };

    const deletarRemedioC = async() => {
        const deletarRemedioC = await db.prepareAsync(`
            DELETE FROM remedioContinuo
            WHERE idRemContinuo = $id;
        `);

        const deletarUsosRemC = await db.prepareAsync(`
            DELETE FROM rmcUsos
            WHERE idUsos IN (
                SELECT idUsos FROM rmcUsos WHERE idRemContinuo = $idRemC
            );
        `);

        try {
            await deletarUsosRemC.executeAsync({$idRemC: id});
            await deletarRemedioC.executeAsync({$idRemC: id});
        } finally {
            await deletarRemedioC.finalizeAsync();
            await deletarUsosRemC.finalizeAsync();
        }

        Alert.alert(
            'Sucesso',
            'Remedio excluido com Sucesso',
            [{text: 'Voltar', onPress: async() => router.back()}]
        );
    };

    const deletarDoseRemedC = async(idUso,idRemC) => {
        const deletarUsosRemC = await db.prepareAsync(`
            DELETE FROM rmcUsos
            WHERE idUsos = $idUso AND (SELECT COUNT(*) FROM rmcUsos WHERE idRemContinuo = $idRemC) >= 1
        `);

        try {
            await deletarUsosRemC.executeAsync({$idUso: idUso, $idRemC: idRemC});
        } finally {
            await deletarUsosRemC.finalizeAsync();
        }

        Alert.alert(
            'Sucesso',
            'Remedio excluido com Sucesso',
            [{text: 'Voltar', onPress: async() => router.back()}]
        );
    };

    useEffect(()=> {
        async function setup(){
            const result = await db.getAllAsync(`
                SELECT
                    r.remcNome AS 'nomeRC',
                    s.rmcHorario AS 'horarioRC',
                    s.rmcQuant AS 'quantRC',
                    s.rmcMedida AS 'medidaRC',
                    s.idUsos AS 'idUsosRC'
                FROM remedioContinuo r
                    INNER JOIN rmcUsos s
                        ON r.idRemContinuo = s.idRemContinuo
                WHERE r.idRemContinuo = ${id}
                ORDER BY s.rmcHorario;
            `);

            if (result && result.length > 0) {

                const horarios = [];
                const quantidades = [];
                const medidas = [];
                const idsUsos = [];
    
                for (let i = 0; i < result.length; i++) {
                    const { nomeRC, horarioRC, quantRC, medidaRC, idUsosRC } = result[i];
                    
                    if (i === 0) setNome(nomeRC);
                    horarios.push(horarioRC);
                    quantidades.push(quantRC);
                    medidas.push(medidaRC);
                    idsUsos.push(idUsosRC);
                }
    
                setHorario(horarios);
                setQuant(quantidades);
                setMedida(medidas);
                setIdUsos(idsUsos);
            }
        }

        const interval = setInterval(() => {
            setup();
        }, 200);
        
        return () => clearInterval(interval);
    }, [db])
    
    const dadosAtualizar = {
        idUsos: idUsos,
        quant: quant,
        medida: medida,
        horario: horario,
        nome: nome,
        id: id
    };

    return (
        <SafeAreaView>
            <ScrollView
            style={{paddingHorizontal: 10}}>
                <View style={styles.medicamentoInfo}>
                <Text style={styles.textAuxiliar}>Nome do Remédio: </Text>
                <TextInput
                placeholder={nome}
                onChangeText={setNome}
                value={nome || ''}
                style={styles.textInputNome}
                />
                {idUsos.map((idUso,index) => {
                    return(
                        <View key={index}>
                            <Text style={{color: '#fffeff', fontFamily: 'Inter_900Black', fontSize: 18}}>{"Dose "+ (index +1)}</Text>
                            <View style={styles.box}>
                                <Text style={styles.textAuxiliar}>Horário: </Text>
                                    <Pressable
                                    onPress={() => showTimepicker(index)}
                                    style={styles.boxTime}>
                                        <Text style={styles.textResult}>{ horario[index] || (date.toLocaleTimeString())}</Text>
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
                                <Text style={styles.textAuxiliar}>Quantidade: </Text>
                                <View style={{flexDirection: 'row'}}>
                                    <TextInput 
                                    placeholder={String(quant[index] || 'Quantidade')}
                                    onChangeText={(value) => handleQuant(index, value)}
                                    value={String(quant[index] || '')}
                                    style={styles.textInputQuant}
                                    />
                                    <View style={styles.picker}>
                                        <Picker
                                        selectedValue={medida[index] || 'U'}
                                        onValueChange={(itemValue) => handleMedida(index, itemValue)}
                                        >
                                            <Picker.Item label='U' value='U' style={styles.textResult}/>
                                            <Picker.Item label='ML' value='ML' style={styles.textResult}/>
                                            <Picker.Item label='Comprimido' value='C' style={styles.textResult}/>
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                            <Pressable
                            style={{flexDirection: 'row-reverse'}}
                            onPress={async() => Alert.alert(
                                'Confirmação',
                                'Deseja excluir a Dose do Remedio?',
                                [
                                    {text: 'Não'},
                                    {text: 'Sim', onPress: async() => deletarDoseRemedC(idUso, id)}
                                ]
                            )}
                            >
                                <Ionicons name="trash" size={24} color="#fffeff" />
                            </Pressable>
                        </View>
                    )
                })}
                <Pressable
                onPress={async() => setIdUsos([...idUsos, idUsos.length+1])}
                style={styles.add}
                >
                    <AntDesign name="plus" size={60} color="#fffeff" />
                </Pressable>
                </View>
                <Pressable
                onPress={async() => Alert.alert(
                    'Confirmação',
                    'Deseja excluir o Rémedio?',
                    [
                        {text: 'Não'},
                        {text: 'Sim', onPress: async() => deletarRemedioC}
                    ]
                )}
                style={styles.buttonExc}
                >
                    <Ionicons name="trash" size={26} color="#fffeff" />
                    <Text style={styles.buttonExcText}> Excluir </Text>
                </Pressable>
                <Pressable
                onPress={async() => atualizarDadosRemedC(dadosAtualizar)}
                style={styles.buttonAtt}
                >
                    <FontAwesome5 name="sync" size={26} color="#fffeff" />
                    <Text style={styles.buttonAttText}> Atualizar </Text>
                </Pressable>
            </ScrollView>
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
        width: 100,
        height: 50,
        borderRadius: 5,
        marginVertical: 3,
        height: 40,
        width: '100%',
        flex: 1,
        justifyContent: 'center',
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
        flex: 1,
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
        marginTop: 50,
        marginBottom: 10,
        borderRadius: 20,
        flex: 1,
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