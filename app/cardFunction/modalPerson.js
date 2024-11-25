import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from 'expo-router';

export default function UpdatePerson() {
	const db = useSQLiteContext();
	const router = useRouter();
	const [show, setShow] = useState(false);
	const [select, setSelect] = useState(true);

	const [peso, setPeso] = useState('');
	const [sono, setSono] = useState('');
	const [pet, setPet] = useState('');
	const [intAgua, setIntAgua] = useState('');
	const [inicio, setInicio] = useState(new Date());
	const [fim, setFim] = useState(new Date());

	useEffect(() => {
		async function setup(){
			const result = await db.getFirstAsync(`
				SELECT *
				FROM person
				WHERE idPerson = 1
			`)
			
			setPeso(result.personPeso)
			setSono(result.personHSono)
			setPet(result.personPet)
			setIntAgua(result.personIntervaloAgua)
			setInicio(new Date(`${new Date().toISOString().split('T')[0]}T${result.personTrabalhoInicio}`))
			setFim(new Date(`${new Date().toISOString().split('T')[0]}T${result.personTrabalhoFim}`))
		}
		setup()
	}, [db])

	const showDatePicker = (isStart) => {
		setSelect(isStart);
		setShow(true);
	};

	const onChange = (event, selectedDate) => {
		setShow(false);
		
		if (select) {
			setInicio(selectedDate);
		} else {
			setFim(selectedDate);
		}
	};

	const updatePerson = async() => {
		if (peso == '' || sono == ''){
			Alert.alert(
				'Dados Incorretos',
				'Por Favor preencha todos os dados',
                [
                    {text: 'OK'}
                ]
			)

			return
		}

		const updatePerson = await db.prepareAsync(`
			UPDATE person
			SET personPeso = $peso, personHSono = $sono, personPet = $pet, personIntervaloAgua = $intAgua, personTrabalhoInicio = $inicio, personTrabalhoFim = $fim
			WHERE idPerson = 1
		`)

		Alert.alert(
			'Confirmação',
			'Deseja atualizar seus dados?',
			[
				{text: 'SIM', onPress: async() => {
					try {
						await updatePerson.executeAsync({
							$peso: peso,
							$sono: sono,
							$pet: pet,
							$intAgua: intAgua,
							$inicio: inicio.toLocaleTimeString(),
							$fim: fim.toLocaleTimeString()
						})
						Alert.alert(
							'Sucesso',
							'Dados atualizados com sucesso',
							[{text: 'OK', onPress: () => router.back()}]
						)
					} finally {
						await updatePerson.finalizeAsync()
					}
				}},
				{text: 'NÃO'}
			]
		)
	}

  return (
	<SafeAreaView style={styles.overlay}>
		<ScrollView style={styles.container}>
			<View style={{padding: 15}}>
				<Text style={styles.label}>Quanto você pesa?</Text>
				<TextInput
					style={styles.input}
					onChangeText={setPeso}
					value={String(peso)}
					keyboardType="number-pad"
				/>
				<Text style={styles.label}>Quantas horas de sono deseja dormir?</Text>
				<TextInput
					style={styles.input}
					placeholder="Horas de Sono"
					onChangeText={setSono}
					value={sono}
					keyboardType="number-pad"
				/>

				<Text style={styles.label}>Possui Pets?</Text>
				<View style={styles.pickerContainer}>
					<Picker selectedValue={pet} onValueChange={setPet}>
					<Picker.Item label="Não" value={0} />
					<Picker.Item label="Sim" value={1} />
					</Picker>
				</View>

				<Text style={styles.label}>Intervalo de Água?</Text>
				<View style={styles.pickerContainer}>
					<Picker selectedValue={intAgua} onValueChange={setIntAgua}>
						<Picker.Item label="1 minuto" value={1} />
						<Picker.Item label="15 minutos" value={15} />
						<Picker.Item label="30 minutos" value={30} />
						<Picker.Item label="1 hora" value={60} />
					</Picker>
				</View>
				<Text style={styles.label}>Horario de Trabalho</Text>
				<Text style={styles.labelAux}>* Caso não trabalhe apenas coloque horas iguais</Text>
				<Text style={styles.labelAux}>{'Exemplo:\n \nInício: 00:00 \nFim: 00:00 \n'}</Text>
				<Pressable
					style={styles.button}
					onPress={() => showDatePicker(true)}
				>
					<Text style={styles.buttonText}>Início:</Text>
					<Text>{inicio ? inicio.toLocaleTimeString().substring(0,5) : 'HH:MM'}</Text>
				</Pressable>

				<Pressable
					style={styles.button}
					onPress={() => showDatePicker(false)}
				>
					<Text style={styles.buttonText}>Fim:</Text>
					<Text>{fim ? fim.toLocaleTimeString().substring(0,5) : 'HH:MM'}</Text>
				</Pressable>

				<Pressable
					style={styles.submitButton}
					onPress={updatePerson}
				>
					<Text style={styles.submitButtonText}>Atualizar</Text>
				</Pressable>
				<Pressable
				onPress={() => router.back()}
				style={styles.buttonClose}
				>
					<Text style={styles.buttonCloseText}> Cancelar </Text>
				</Pressable>

				{show && (
					<DateTimePicker
					onChange={onChange}
					value={select ? new Date(inicio) : new Date(fim)}
					is24Hour={true}
					mode='time'
					/>
				)}
			</View>
		</ScrollView>
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
	label: {
	  fontSize: 18,
	  color: '#000000',
	  marginBottom: 8,
	  fontFamily: 'Inter_600SemiBold',
	},
	labelAux: {
		fontSize: 14,
		color: '#000000',
		marginBottom: 8,
		fontFamily: 'Inter_500Medium',
	  },
	input: {
	  borderWidth: 1,
	  borderColor: '#CCCCCC',
	  borderRadius: 10,
	  padding: 12,
	  backgroundColor: '#F5F5F5',
	  fontSize: 16,
	  color: '#000000',
	  marginBottom: 20,
	},
	pickerContainer: {
	  borderWidth: 1,
	  borderColor: '#CCCCCC',
	  borderRadius: 10,
	  backgroundColor: '#F5F5F5',
	  paddingVertical: 5,
	  marginBottom: 20,
	},
	button: {
	  backgroundColor: '#e0dee0',
	  padding: 12,
	  borderRadius: 10,
	  alignItems: 'center',
	  marginBottom: 20,
	  shadowColor: '#000',
	  shadowOffset: { width: 0, height: 2 },
	  shadowOpacity: 0.1,
	  shadowRadius: 5,
	  elevation: 3,
	},
	buttonText: {
	  fontSize: 16,
	  color: '#000',
	  fontFamily: 'Inter_700Bold',
	},
	submitButton: {
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
	submitButtonText: {
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