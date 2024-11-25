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
    const [medida, setMedida] = useState('ML');
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
                setComeco(date)
                setShowTimePicker(true)
            } else {
                setFinal(date)
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
        if(nome == '' || quant == '' || intervalo == '' || final == null || comeco == null){
            Alert.alert(
				'Dados Incorretos',
				'Por Favor preencha todos os dados',
                [
                    {text: 'OK'}
                ]
			)

            return
        }
        const registrarRemedio = await db.prepareAsync(`
            INSERT INTO remedio (remNome, remQuant, remMedida, remComeco, remIntervaloDoses, remFinal)
            SELECT $nome, $quant, $medida, $comeco, $intervalo, $final
            WHERE NOT EXISTS (
                SELECT 1 FROM remedio WHERE remNome = $nome
            );
        `);
        const registrarHorarios = await db.prepareAsync(`
            WITH RECURSIVE horarios AS (
                SELECT
                    idRemedio,
                    DATETIME(remComeco, 'localtime') AS 'remHorario'
                FROM remedio
                WHERE DATETIME(remComeco, 'localtime') > DATETIME('now', 'localtime')
                UNION ALL
                SELECT
                    r.idRemedio,
                    DATETIME(h.remHorario, '+' || r.remIntervaloDoses || ' hour', 'localtime') AS 'remHorario'
                FROM horarios h
                    INNER JOIN remedio r ON h.idRemedio = r.idRemedio
                WHERE DATETIME(h.remHorario, '+' || r.remIntervaloDoses || ' hour', 'localtime') <= r.remFinal
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
                    {text: 'OK', onPress: () => router.back()}
                ]
            );
        } finally {
            registrarRemedio.finalizeAsync()
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.textAuxiliar}>Nome do Rémedio:</Text>
            <TextInput
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
                style={styles.timePicker}
            >
                <Text style={styles.text}>
                    {comeco ? comeco.toLocaleString().substring(0, 16) : 'HH:MM'}
                </Text>
            </Pressable>
            <Text style={styles.textAuxiliar}>Final do Tratamento:</Text>
            <Pressable
                onPress={() => {
                    setIsStartDate(false);
                    setShowDatePicker(true);
                }}
                style={styles.timePicker}
            >
                <Text style={styles.text}>
                    {final ? final.toLocaleString().substring(0, 16) : 'HH:MM'}
                </Text>
            </Pressable>
            {showDatePicker && (
                <DateTimePicker
                    value={isStartDate ? (comeco || new Date()) : (final || new Date())}
                    mode="date"
                    onChange={handleConfirmDate}
                    minimumDate={new Date()}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={isStartDate ? (comeco || new Date()) : (final || new Date())}
                    mode="time"
                    onChange={handleConfirmTime}
                />
            )}
            <Text style={styles.textAuxiliar}>Quantidade:</Text>
            <View style={styles.componentBox}>
                <TextInput
                    onChangeText={setQuant}
                    value={quant || ''}
                    style={styles.textInputQuant}
                    keyboardType='number-pad'
                />
                <Picker
                    selectedValue={medida}
                    onValueChange={(itemValue) => setMedida(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="U" value="U" style={{fontFamily: 'Inter_500Medium'}}/>
                    <Picker.Item label="ML" value="ML" style={{fontFamily: 'Inter_500Medium'}}/>
                    <Picker.Item label="Comprimido" value="C" style={{fontFamily: 'Inter_500Medium'}}/>
                </Picker>
            </View>
            <Text style={styles.textAuxiliar}>Intervalo entre as Doses:</Text>
            <View style={styles.componentBox}>
                <TextInput
                    placeholder='HH:MM'
                    onChangeText={setIntervalo}
                    value={intervalo || ''}
                    style={styles.textInputQuant}
                />
            </View>
            <Pressable onPress={enviarDados} style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Registrar</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
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
    componentBox: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
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
    textInputQuant: {
        backgroundColor: '#ffffff',
        fontSize: 16,
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginBottom: 10,
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
    text: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#333333',
    },
    textAuxiliar: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#444444',
        marginBottom: 5,
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
