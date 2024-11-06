import { View, Text, TextInput, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';

export default function RemedioContinuo(){
    const db = useSQLiteContext();
    const router = useRouter();

    const [components, setComponents] = useState([0]);
    const [nome, setNome] = useState([''])
    const [quant, setQuant] = useState(['']);
    const [medida, setMedida] = useState(['']);
    const [horario, setHorario] = useState(['']);

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

    const handleNome = (index, value) => {
        const updatedNome = [...nome];
        updatedNome[index] = value;
        setNome(updatedNome);
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

    const enviarDados = async() => {
        const registrarNomeRemedio = await db.prepareAsync(`
            INSERT INTO remedioContinuo (remcNome)
            SELECT $nome
            WHERE (SELECT COUNT(*) FROM remedioContinuo WHERE remcNome = $nome) = 0
            `);
        
        const obterIdRemedio = await db.prepareAsync(`
            SELECT idRemContinuo FROM remedioContinuo WHERE remcNome = $nome
        `);

        const registrarUsos = await db.prepareAsync(`
            INSERT INTO rmcUsos (idRemContinuo, rmcQuant, rmcMedida, rmcHorario) VALUES ($idRemedioC, $quant, $medida, $horario)
        `);

        try {
            for (let i = 0; i < components.length; i++) {
                const nomeIndex = nome[i];
                const horarioIndex = horario[i];
                const quantIndex = quant[i];
                const medidaIndex = medida[i];

                await registrarNomeRemedio.executeAsync({$nome: nomeIndex});
                const idRemedioContinuo = await obterIdRemedio.executeAsync({$nome: nomeIndex});
                const rowsIdRemedioContinuo = await idRemedioContinuo.getFirstAsync()
                const resultIdRemedioContinuo = rowsIdRemedioContinuo.idRemContinuo
                await registrarUsos.executeAsync({
                    $idRemedioC: resultIdRemedioContinuo,
                    $quant: quantIndex,
                    $medida: medidaIndex,
                    $horario: horarioIndex
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
        } finally {
            await registrarNomeRemedio.finalizeAsync();
            await registrarUsos.finalizeAsync();
            await obterIdRemedio.finalizeAsync();
        }
    }

    return(
        <ScrollView>
            {components.map((__,index) => {
                return(
                    <View key={index}>
                        <TextInput 
                        placeholder='Nome do Remedio'
                        onChangeText={(value) => handleNome(index, value)}
                        value={nome[index] || ''}
                        style={{}}
                        />
                        <Pressable onPress={() => showTimepicker(index)} style={{}}>
                            <Text style={{}}>{horario[index].substring(0, 5) || (date.toLocaleTimeString()).substring(0, 5)}</Text>
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
                            placeholder='Quantidade'
                            onChangeText={(value) => handleQuant(index, value)}
                            value={quant[index] || ''}
                            style={{}}
                            />
                            <Picker
                            selectedValue={medida[index]}
                            onValueChange={(itemValue) => handleMedida(index, itemValue)}
                            >
                                <Picker.Item label='U' value='U'/>
                                <Picker.Item label='ML' value='ML'/>
                                <Picker.Item label='Comprimido' value='C'/>
                            </Picker>
                        </View>
                    </View>
                )
            })
            }

            <Pressable
            onPress={async() => setComponents([...components, components.length])}
            >
                <Text>click</Text>
            </Pressable>

            <Pressable
            onPress={enviarDados}
            style={{}}
            >
                <Text> Registrar </Text>
            </Pressable>
    </ScrollView>
    )
}