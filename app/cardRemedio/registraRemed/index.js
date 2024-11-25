import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import RemedioContinuo from './regRemedioC';
import Remedio from './regRemedio';

export default function RegistraRemed() {
    const router = useRouter();
    const [alterna, setAlterna] = useState(false);

    return (
        <SafeAreaView style={styles.modal}>
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={async () => setAlterna(false)} style={[styles.buttonActive, alterna && styles.button]}>
                        <Text style={[styles.buttonTextActive, alterna && styles.buttonText]}>Tratamento Normal</Text>
                    </Pressable>
                    <Pressable onPress={async () => setAlterna(true)} style={[styles.button, alterna && styles.buttonActive]}>
                        <Text style={[styles.buttonText, alterna && styles.buttonTextActive]}>Tratamento Continuo</Text>
                    </Pressable>
                </View>
                <AlternaTratamento change={alterna} />
                <Pressable onPress={() => router.back()} style={styles.btnCancel}>
                    <Text style={styles.textCancel}>Cancelar</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

function AlternaTratamento({ change: Enable }) {
    if (Enable) {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <RemedioContinuo />
            </ScrollView>
        );
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Remedio />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    container: {
        borderRadius: 15,
        width: '90%',
        padding: 15,
        backgroundColor: '#FFF'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    buttonActive: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#333333',
    },
    buttonTextActive: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#fff',
    },
    medicamentoInfo: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderColor: '#d3d3d3',
        borderWidth: 1,
    },
    textAuxiliar: {
        fontSize: 18,
        color: '#333333',
        fontFamily: 'Inter_700Bold',
    },
    btnCancel: {
        backgroundColor: '#d3d3d3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    textCancel: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
});