import { View, Text, TextInput, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

export default function editaRemd(){
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const db = useSQLiteContext();

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

    const atualizarDados = async() => {
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
                    $horario: horarioIndex,
                    $id: id
                });
                
                await adicionarNovosUsos.executeAsync({
                    $idUsos: idUsosIndex,
                    $quant: quantIndex,
                    $medida: medidaIndex,
                    $horario: horarioIndex,
                    $idRemContinuo: id
                });

            }
            Alert.alert(
                'Sucesso',
                'Remedio registrado com sucesso',
                [
                    {text: 'Voltar', onPress: () => {
                        router.back()
                    }}
                ]
            );
            const result = await db.getAllAsync('SELECT * FROM rmcUsos');
            console.log(result);
            
        } finally {
            await atualizarNomeRemedio.finalizeAsync();
            await atualizarUsos.finalizeAsync();
            await adicionarNovosUsos.finalizeAsync();
        }
    }

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

        setup();
    }, [db])
    
    return (
        <ScrollView>
            <TextInput 
            placeholder={nome}
            onChangeText={setNome}
            value={nome || ''}
            style={{}}
            />
            {idUsos.map((__,index) => {
                return(
                    <View key={index}>
                        <Pressable onPress={() => showTimepicker(index)} style={{}}>
                            <Text style={{}}>{horario[index] || (date.toLocaleTimeString())}</Text>
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
                        <View>
                            <TextInput 
                            placeholder={String(quant[index] || 'Quantidade')}
                            onChangeText={(value) => handleQuant(index, value)}
                            value={String(quant[index] || '')}
                            style={{}}
                            />
                            <Picker
                            selectedValue={medida[index] || 'U'}
                            onValueChange={(itemValue) => handleMedida(index, itemValue)}
                            >
                                <Picker.Item label='U' value='U'/>
                                <Picker.Item label='ML' value='ML'/>
                                <Picker.Item label='Comprimido' value='C'/>
                            </Picker>
                        </View>
                    </View>
                )
            })}
            <Pressable
            onPress={async() => setIdUsos([...idUsos, idUsos.length+1])}
            >
                <Text>click</Text>
            </Pressable>

            <Pressable
            onPress={atualizarDados}
            style={{}}
            >
                <Text> Atualizar </Text>
            </Pressable>
        </ScrollView>
    )
}