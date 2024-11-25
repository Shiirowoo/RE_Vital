import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { View, Text, Alert, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ModalSono() {
    const db = useSQLiteContext();
    const router = useRouter();
    const [iniDorm, setIniDorm] = useState(new Date());
    const [fimDorm, setFimDorm] = useState(new Date());

    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [select, setSelect] = useState(true);

    const onChange = (event, selectedDate) => {
        if (event.type === "dismissed") {
            setShow(false);
            setMode('date');
            return
        }

        if (mode == 'date'){
            if (select) {
                setIniDorm(selectedDate);
            } else {
                setFimDorm(selectedDate);
            }
            setMode('time')
        } else {
            if (select) {
                setIniDorm(selectedDate);
            } else {
                setFimDorm(selectedDate);
            }
            setShow(false)
        }
    };

    const showDorm = (state) => {
        setMode('date');
        setSelect(state);
        setShow(true);
    }

    const insertDorm = async () => {

        const updateDorm = await db.prepareAsync(`
            UPDATE sono 
            SET sonoDateIni = $iniDorm, sonoDateFim = $fimDorm
            WHERE STRFTIME('%d-%m-%Y', sonoDateFim, 'localtime') = STRFTIME('%d-%m-%Y',DATETIME('now', 'localtime'));
        `);

        const insertDorm = await db.prepareAsync(`
            INSERT INTO sono (idPerson, sonoDateIni, sonoDateFim) VALUES
            (1, $iniDorm, $fimDorm);
        `);

        const checkRegistros = await db.getFirstAsync(`
            SELECT COUNT(*)
            FROM sono
            WHERE STRFTIME('%d-%m-%Y', DATETIME(sonoDateFim, 'localtime')) = STRFTIME('%d-%m-%Y',DATETIME('now', 'localtime'));
        `)
        
        if (checkRegistros['COUNT(*)'] == 1){
            Alert.alert(
                'Já Existe',
                'Você já registrou o sono de hoje, deseja atualizar os dados?',
                [
                    {text: 'SIM', onPress: async() => {
                        try{
                            await updateDorm.executeAsync({ $iniDorm: iniDorm.toISOString(), $fimDorm: fimDorm.toISOString() })
                            Alert.alert(
                                'Sucesso',
                                'Sono atualizado com sucesso',
                                [{text: 'OK', onPress: () => router.back()}]
                            )
                        } finally{
                            await updateDorm.finalizeAsync()
                        }
                    }},
                    {text: 'NÃO'}
                ]
            )
        } else {
            try {
                await insertDorm.executeAsync({ $iniDorm: iniDorm.toISOString(), $fimDorm: fimDorm.toISOString() });
                Alert.alert(
                    'Sucesso',
                    'Sono inserido com sucesso',
                    [{text: 'OK', onPress: () => router.back()}]
                )
            } finally {
                await insertDorm.finalizeAsync();
            }
        }
    };

    return (
        <SafeAreaView style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.textAuxiliar}>Início do Sono:</Text>
                <Pressable 
                style={styles.dateInput}
                onPress={() => showDorm(true)}>
                    <MaterialCommunityIcons name="calendar" size={30} color="white" />
                    <Text style={styles.textData}>{iniDorm ? iniDorm.toLocaleString().substring(0, 16) : new Date().toLocaleString().substring(0, 16)}</Text>
                </Pressable>
                <Text style={styles.textAuxiliar}>Fim do Sono:</Text>
                <Pressable
                style={styles.dateInput}
                onPress={() => showDorm(false)}>
                    <MaterialCommunityIcons name="calendar" size={30} color="white" />
                    <Text style={styles.textData}>{fimDorm ? fimDorm.toLocaleString().substring(0, 16) : new Date().toLocaleString().substring(0, 16)}</Text>
                </Pressable>
                {show &&
                    <DateTimePicker
                        mode={mode}
                        value={select ? iniDorm : fimDorm}
                        minimumDate={new Date().setDate(new Date().getDate() - 1)}
                        maximumDate={new Date()}
                        onChange={onChange}
                    />
                }
                <Pressable style={styles.buttonEnv} onPress={insertDorm}>
                    <Text style={styles.buttonEnvText}>Enviar</Text>
                </Pressable>
                <Pressable
                onPress={() => router.back()}
                style={styles.buttonClose}
                >
                    <Text style={styles.buttonCloseText}> Cancelar </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        flex: 1,
        justifyContent: 'center',               
        alignItems: 'center',
    },
    container: {
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
    textAuxiliar: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#444444',
        marginBottom: 5,
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "#000",
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 20
    },
    textData: {
        fontFamily: 'Inter_500Medium',
        fontSize: 20,
        color: '#FFF',
    },
    buttonEnv: {
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
    buttonEnvText: {
        color: '#ffffff',
        marginLeft: 5,
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    buttonClose: {
        backgroundColor: '#d3d3d3',
        padding: 15,
        marginTop: 5,
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