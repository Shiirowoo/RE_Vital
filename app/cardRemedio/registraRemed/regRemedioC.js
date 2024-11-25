import { View, Text, TextInput, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';

export default function RemedioContinuo(){
    const db = useSQLiteContext();
    const router = useRouter();

    const [components, setComponents] = useState([0]);
    const [nome, setNome] = useState('')
    const [quant, setQuant] = useState(['']);
    const [medida, setMedida] = useState(['U']);
    const [horario, setHorario] = useState(['']);

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
        for (let i = 0; i < components.length; i++) {
            if (nome == '' || medida[i] == '' || quant[i] == ''){
                Alert.alert(
                    'Dados Incorretos',
                    'Por Favor preencha todos os dados'
                )
    
                return
            }
        }
        try {
            for (let i = 0; i < components.length; i++) {
                const horarioIndex = horario[i];
                const quantIndex = quant[i];
                const medidaIndex = medida[i];

                await registrarNomeRemedio.executeAsync({$nome: nome});
                const idRemedioContinuo = await obterIdRemedio.executeAsync({$nome: nome});
                const rowsIdRemedioContinuo = await idRemedioContinuo.getFirstAsync();
                const resultIdRemedioContinuo = rowsIdRemedioContinuo.idRemContinuo;
                await registrarUsos.executeAsync({
                    $idRemedioC: resultIdRemedioContinuo,
                    $quant: quantIndex,
                    $medida: medidaIndex,
                    $horario: horarioIndex.toISOString()
                });

            }
            Alert.alert(
                'Sucesso',
                'Remedio registrado com sucesso',
                [
                    {text: 'Voltar', onPress: () => router.back()}
                ]
            );
        } finally {
            await registrarNomeRemedio.finalizeAsync();
            await registrarUsos.finalizeAsync();
            await obterIdRemedio.finalizeAsync();
        }
    }

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.textAuxiliar}>Nome do Remédio: </Text>
            <TextInput
                onChangeText={setNome}
                value={nome || ''}
                style={styles.textInputNome}
            />
            <View style={styles.dosesContainer}>
                {components.map((__, index) => (
                    <View key={index} style={styles.componentBox}>
                        <Text style={styles.textAuxiliar}>Dose {index + 1}</Text>
                        <Text style={styles.textAuxiliar}>Horário:</Text>
                        <Pressable
                            onPress={() => showTimepicker(index)}
                            style={styles.timePicker}
                        >
                            <Text style={styles.text}>
                                {horario[index] ? horario[index].toLocaleTimeString().substring(0,5) : 'HH:MM'}
                            </Text>
                        </Pressable>
                        {show && (
                            <DateTimePicker
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={(e, selectedDate) => onChange(e, selectedDate)}
                            />
                        )}
                        <Text style={styles.textAuxiliar}>Quantidade:</Text>
                        <View style={styles.quantContainer}>
                            <TextInput
                                onChangeText={(value) => handleQuant(index, value)}
                                value={String(quant[index] || '')}
                                style={styles.textInputQuant}
                            />
                            <Picker
                                selectedValue={medida[index]}
                                onValueChange={(itemValue) => handleMedida(index, itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="U" value="U" style={{fontFamily: 'Inter_500Medium'}}/>
                                <Picker.Item label="ML" value="ML" style={{fontFamily: 'Inter_500Medium'}}/>
                                <Picker.Item label="Comprimido" value="C" style={{fontFamily: 'Inter_500Medium'}}/>
                            </Picker>
                        </View>
                    </View>
                ))}
                <Pressable
                    onPress={() => setComponents([...components, components.length])}
                    style={styles.addButton}
                >
                    <AntDesign name="plus" size={60} color="#000" />
                </Pressable>
            </View>
            <Pressable onPress={enviarDados} style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Registrar</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    textAuxiliar: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#444444',
        marginBottom: 5,
    },
    textInputNome: {
        backgroundColor: '#ffffff',
        fontSize: 18,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    dosesContainer: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    componentBox: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 3,
    },
    timePicker: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#333333',
    },
    quantContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textInputQuant: {
        backgroundColor: '#ffffff',
        fontSize: 16,
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    picker: {
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: 5,
    },
    addButton: {
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    registerButton: {
        flex: 1,
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
    },
});
