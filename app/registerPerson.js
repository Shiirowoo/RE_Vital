import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSQLiteContext } from 'expo-sqlite';

function RegisterPerson() {
	const db = useSQLiteContext();
	const [show, setShow] = useState(false);
	const [select, setSelect] = useState(true);

	const [peso, setPeso] = useState('');
	const [sono, setSono] = useState('');
	const [pet, setPet] = useState('');
	const [intAgua, setIntAgua] = useState('');
	const [inicio, setInicio] = useState(null);
	const [fim, setFim] = useState(null);

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

	const registerPerson = async() => {
		if (peso == '' || sono == ''){
			Alert.alert(
				'Dados Incorretos',
				'Por Favor preencha todos os dados'
			)

			return
		}
		const insertPerson = await db.prepareAsync(`
			INSERT INTO person (personPeso, personHSono, personPet, personIntervaloAgua, personTrabalhoInicio, personTrabalhoFim) VALUES (
			$peso, $sono, $pet, $intAgua, $inicio, $fim);
		`)
		try {
			await insertPerson.executeAsync({
				$peso: peso,
				$sono: sono,
				$pet: pet,
				$intAgua: intAgua,
				$inicio: inicio.toISOString(),
				$fim: fim.toISOString()
			})
			Alert.alert('Sucesso', 'Registrado com sucesso')
		} finally {
			await insertPerson.finalizeAsync()
		}
	}

  	return (
		<SafeAreaView style={styles.overlay}>
			<ScrollView style={styles.container}>
				<View style={{padding: 15}}>
					<Text style={styles.label}>Quanto você pesa?</Text>
					<TextInput
					style={styles.input}
					placeholder="Peso (kg)"
					onChangeText={setPeso}
					value={peso}
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
						<Picker selectedValue={pet || 0} onValueChange={setPet}>
							<Picker.Item label="Não" value={0} />
							<Picker.Item label="Sim" value={1} />
						</Picker>
					</View>

					<Text style={styles.label}>Intervalo de Água?</Text>
					<View style={styles.pickerContainer}>
						<Picker selectedValue={intAgua || 15} onValueChange={setIntAgua}>
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
						<Text>{inicio ? inicio.toLocaleTimeString() : 'Selecionar hora'}</Text>
					</Pressable>

					<Pressable
						style={styles.button}
						onPress={() => showDatePicker(false)}
					>
						<Text style={styles.buttonText}>Fim:</Text>
						<Text>{fim ? fim.toLocaleTimeString() : 'Selecionar hora'}</Text>
					</Pressable>

					<Pressable
						style={styles.submitButton}
						onPress={() => registerPerson()}
					>
						<Text style={styles.submitButtonText}>Enviar</Text>
					</Pressable>

					{show && (
						<DateTimePicker
						onChange={onChange}
						value={select ? (inicio || new Date()) : (fim || new Date())}
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

export default RegisterPerson;
