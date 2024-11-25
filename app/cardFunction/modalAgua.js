import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useState } from "react";

export default function ModalAgua() {
    const db = useSQLiteContext();
    const router = useRouter();
    const [quant, setQuant] = useState('');

    const insertQuant = async () => {
        const updQuantAgua = await db.prepareAsync(`
            UPDATE agua
            SET aguaQuant = (aguaQuant + $quant), aguaData = DATETIME('now', 'localtime')
            WHERE STRFTIME('%d-%m-%Y', aguaData) = STRFTIME('%d-%m-%Y', DATETIME('now', 'localtime'));
        `);
        if (quant == '' || quant == 0){
            Alert.alert(
                'Dados Incorretos',
                'Por Favor insira uma quantidade válida no campo.',
            )
            return
        }
        try {
            await updQuantAgua.executeAsync({ $quant: quant });
            Alert.alert(
                'Sucesso',
                'Água ingerida atualizado com sucesso',
                [{text: 'OK', onPress: () => router.back()}]
            )
        } finally {
            await updQuantAgua.finalizeAsync();
        }
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.title}>Quantidade de Água</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Quantidade de Água (ML)"
                    onChangeText={setQuant}
                    value={quant}
                    keyboardType="numeric"
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Pressable style={styles.buttonEnv} onPress={insertQuant}>
                        <Text style={styles.textEnv}>Enviar</Text>
                    </Pressable>
                    <Pressable style={styles.buttonClose} onPress={() => router.back()}>
                        <Text style={styles.textClose}>Cancelar</Text>
                    </Pressable>
                </View>
            </View>
        </View>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        width: '90%',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
    },
    input: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 20,
        fontSize: 16,
        color: '#333333',
    },
    buttonEnv: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 15,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonClose: {
        flex: 1,
        backgroundColor: '#d3d3d3',
        borderRadius: 8,
        padding: 15,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textEnv: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_700Bold'
    },
    textClose: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold'
    },
});