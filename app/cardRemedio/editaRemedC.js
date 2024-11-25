import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { View, Text, TextInput, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';


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
        handleHorario(currentIndex, selectedDate);
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

    const atualizarDadosRemedC = async() => {
        const atualizarNomeRemedio = await db.prepareAsync(`
            UPDATE remedioContinuo
            SET remcNome = $nome
            WHERE remcNome != $nome;
        `);
        
        const atualizarUsos = await db.prepareAsync(`
            UPDATE rmcUsos 
            SET rmcQuant = $quant, rmcMedida = $medida, rmcHorario = $horario
            WHERE idUsos = $idUsos;
        `);
            
        const adicionarNovosUsos = await db.prepareAsync(`
            INSERT INTO rmcUsos (rmcQuant, rmcMedida, rmcHorario, idRemContinuo)
            SELECT $quant, $medida, $horario, $idRemContinuo
            WHERE (SELECT COUNT(*) FROM rmcUsos WHERE idUsos = $idUsos) = 0;
        `);
        
        try {
            for (let i = 0; i < idUsos.length; i++) {
                const idUsosIndex = idUsos[i];
                const horarioIndex = horario[i];
                const quantIndex = quant[i];
                const medidaIndex = medida[i];
        
                await atualizarNomeRemedio.executeAsync({$nome: nome});
                await atualizarUsos.executeAsync({
                    $idUsos: idUsosIndex,
                    $quant: quantIndex,
                    $medida: medidaIndex,
                    $horario: horarioIndex.toISOString(),
                    $id: id
                });
                    
                await adicionarNovosUsos.executeAsync({
                    $idUsos: idUsosIndex,
                    $quant: quantIndex,
                    $medida: medidaIndex,
                    $horario: horarioIndex.toISOString(),
                    $idRemContinuo: id
                });
        
            }
            Alert.alert(
                'Sucesso',
                'Remedio atualizado com sucesso',
                [
                    {text: 'Voltar', onPress: () => router.back()}
                ]
            );
                
        } finally {
            await atualizarNomeRemedio.finalizeAsync();
            await atualizarUsos.finalizeAsync();
            await adicionarNovosUsos.finalizeAsync();
        }
    }

    const deletarRemedioC = async() => {
        const delRemedioC = await db.prepareAsync(`
            DELETE FROM remedioContinuo
            WHERE idRemContinuo = $id;
        `);

        const delUsosRemC = await db.prepareAsync(`
            DELETE FROM rmcUsos
            WHERE idUsos IN (
                SELECT idUsos FROM rmcUsos WHERE idRemContinuo = $idRemC
            );
        `);
        try {
            await delUsosRemC.executeAsync({$idRemC: id});
            await delRemedioC.executeAsync({$id: id});
            Alert.alert(
                'Sucesso',
                'Remedio excluido com Sucesso',
                [{text: 'OK', onPress: () => router.back()}]
            );
        } finally {
            await delRemedioC.finalizeAsync();
            await delUsosRemC.finalizeAsync();
        }
    };

    const deletarDoseRemedC = async(idUso,idRemC) => {
        const deletarUsosRemC = await db.prepareAsync(`
            DELETE FROM rmcUsos
            WHERE idUsos = $idUso
        `);

        const checkDosesRemC = await db.getFirstAsync(`
            SELECT COUNT(*)
            FROM rmcUsos
            WHERE idRemContinuo = ${idRemC}
        `);

        try {
            if (checkDosesRemC["COUNT(*)"] > 1){
                await deletarUsosRemC.executeAsync({$idUso: idUso});
                Alert.alert(
                    'Sucesso',
                    'Dose excluida com Sucesso',
                    [{text: 'OK'}]
                );
            } else {
                Alert.alert(
                    'AVISO',
                    'Você possui apenas 1 dose de seu remédio, ao excluir essa dose, você irá excluir o remedio também, deseja prosseguir?',
                    [
                        {text: 'NÃO'},
                        {text: 'SIM', onPress: () => deletarRemedioC()}
                    ]
                );
            }
        } finally {
            await deletarUsosRemC.finalizeAsync();
        }
    };

    useEffect(()=> {
        async function setup(){
            const result = await db.getAllAsync(`
                SELECT
                    r.remcNome AS 'nomeRC',
                    DATETIME(s.rmcHorario, 'localtime') AS 'horarioRC',
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
                    horarios.push(new Date(horarioRC));
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

        setup();
    }, [db])

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modal}>
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
                                    <Text style={{color: '#000', fontFamily: 'Inter_900Black', fontSize: 18}}>{"Dose "+ (index +1)}</Text>
                                    <View style={styles.box}>
                                        <Text style={styles.textAuxiliar}>Horário: </Text>
                                            <Pressable
                                            onPress={() => showTimepicker(index)}
                                            style={styles.boxTime}>
                                                <Text style={styles.textResult}>{ horario[index] ? horario[index].toLocaleTimeString() : 'HH:MM'}</Text>
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
                                        <Pressable
                                        style={{flexDirection: 'row-reverse'}}
                                        onPress={() => Alert.alert(
                                            'Confirmação',
                                            'Deseja excluir a Dose do Remedio?',
                                            [
                                                {text: 'NÃO'},
                                                {text: 'SIM', onPress: () => deletarDoseRemedC(idUso, id)}
                                            ]
                                        )}
                                        >
                                            <Ionicons name="trash" size={24} color="#000" />
                                        </Pressable>
                                    </View>
                                </View>
                            )
                        })}
                        <Pressable
                        onPress={async() => setIdUsos([...idUsos, idUsos.length+1])}
                        style={styles.add}
                        >
                            <AntDesign name="plus" size={60} color="#000" />
                        </Pressable>
                        <View style={styles.buttonContainer}>
                            <Pressable
                            onPress={() => Alert.alert(
                                'Confirmação',
                                'Deseja excluir o Rémedio?',
                                [
                                    {text: 'NÃO'},
                                    {text: 'SIM', onPress: () => deletarRemedioC()}
                                ]
                            )}
                            style={styles.buttonExc}
                            >
                                <Text style={styles.buttonExcText}>Excluir</Text>
                            </Pressable>
                            <Pressable
                            onPress={() => atualizarDadosRemedC()}
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
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    medicamentoInfo: {
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
    box: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    textInputNome: {
        backgroundColor: '#ffffff',
        padding: 10,
        fontSize: 18,
        borderRadius: 5,
        marginBottom: 15,
        borderColor: '#d3d3d3',
        borderWidth: 1,
        color: '#333333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    textAuxiliar: {
        fontSize: 16,
        color: '#333333',
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 5,
    },
    boxTime: {
        backgroundColor: '#ffffff',
        width: '100%',
        borderRadius: 5,
        marginVertical: 3,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d3d3d3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    textResult: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        textAlign: 'center',
        color: '#333333',
    },
    textInputQuant: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        backgroundColor: '#ffffff',
        paddingLeft: 10,
        marginVertical: 5,
        width: '65%',
        height: 50,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    picker: {
        backgroundColor: '#ffffff',
        width: '35%',
        height: 50,
        marginVertical: 5,
        borderLeftWidth: 1,
        borderColor: '#d3d3d3',
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    },
    add: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        borderRadius: 10,
        marginVertical: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
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
