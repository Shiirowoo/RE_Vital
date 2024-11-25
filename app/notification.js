import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as SQLite from 'expo-sqlite';

import AsyncStorage from '@react-native-async-storage/async-storage';


async function PushNotifications() {
		let token;

		const projectId = Constants.expoConfig?.extra?.eas?.projectId
		if (!projectId) {
				alert('Erro: projectID não encontrado. Verifique suas configurações.');
				return;
		}

		if (Platform.OS === 'android') {
			await Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				sound: true,
			});
		}
	
		const { status } = await Notifications.requestPermissionsAsync();
		
		if (status !== 'granted') {
			alert('Falha ao obter permissões de notificação!');
			return;
		}
	
		token = (await Notifications.getExpoPushTokenAsync({
				projectId: projectId
			})).data;
		return token;
}

export default function Permission() {
	const [ expoPushToken, setExpoPushToken ] = useState('');
	const [ playSound, setPlaySound] = useState(true);

	const [eventos, setEventos] = useState([]);
	const [pet, setPet] = useState([]);
	const [remedio, setRemedio] = useState([]);
	const [remedioC, setRemedioC] = useState([]);
	const [inter, setInter] = useState('');

	useEffect(() => {
		PushNotifications().then(token => setExpoPushToken(token));

		Notifications.setNotificationHandler({
			handleNotification: async() => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: false
			})
		})

		async function cancelarNotificacoesPorTitulo(titulo) {
			try {
			  	const storedNotifications = await AsyncStorage.getItem('notifications');
			  	const notifications = storedNotifications ? JSON.parse(storedNotifications) : {};
		  
			  	if (notifications[titulo]) {
					for (const notificationId of notifications[titulo]) {
				  		await Notifications.cancelScheduledNotificationAsync(notificationId);
					}
		  
					delete notifications[titulo];
					await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
			  	}
			} catch (error) {
			  console.error('Erro ao cancelar notificações:', error);
			}
		}
		  
		async function agendarNotificacao(titulo, body, trigger) {
			try {
			  	await cancelarNotificacoesPorTitulo(titulo);
			
			const notificationId = await Notifications.scheduleNotificationAsync({
				content: {
				  	title: titulo,
				  	body: body,
				  	sound: playSound,
				},
				trigger: trigger,
			});
		  
			const storedNotifications = await AsyncStorage.getItem('notifications');
			const notifications = storedNotifications ? JSON.parse(storedNotifications) : {};
		  
			  	if (!notifications[titulo]) {
					notifications[titulo] = [];
			  	}
			  	notifications[titulo].push(notificationId);
		  
			  	await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
				
			} catch (error) {
				console.error('Erro ao cancelar notificações:', error);
			}
		}

		async function extraiDados(){
			const db = await SQLite.openDatabaseAsync('revital.db')

			const resultTrabalho = await db.getFirstAsync(`
				SELECT 
					CASE 
						WHEN TIME('now', 'localtime') BETWEEN TIME(personTrabalhoInicio, 'localtime') AND TIME(personTrabalhoFim, 'localtime')
						THEN 1 
						ELSE 0 
					END AS 'verify'
				FROM 
					person;
			`)

			const resultAguaInter = await db.getFirstAsync(`
				SELECT
					personIntervaloAgua AS 'interA'
				FROM person
			`);

			const resultEventos = await db.getAllAsync(`
				SELECT
					evNome AS 'nome',
					DATETIME(evData, 'localtime') AS 'data'
				FROM evento
				WHERE TIME(evData, 'localtime') >= TIME('now', 'localtime') 
				ORDER BY evData;
			`);

			const resultPet = await db.getAllAsync(`
				SELECT 
					petNomeEvent AS 'nome',
					(DATE('now', 'localtime') ||'T'||TIME(petHoraEvent, 'localtime')) AS 'data'
				FROM pet
				WHERE TIME(petHoraEvent, 'localtime') >= TIME('now', 'localtime')
				ORDER BY petHoraEvent;
			`);

			const resultRemedio = await db.getAllAsync(`
				SELECT
					r.remNome AS 'nome',
					DATETIME(MIN(h.remHorario), 'localtime') AS 'data'
				FROM remedio r
					INNER JOIN remHora h
						ON r.idRemedio = h.idRemedio
				WHERE DATETIME(h.remHorario) >= DATETIME('now', 'localtime')
				GROUP BY r.remNome;
			`);

			const resultRemedioC = await db.getAllAsync(`
				SELECT
					rc.remcNome AS 'nome',
					DATETIME(DATE('now', 'localtime') ||'T'||TIME(s.rmcHorario, 'localtime')) AS 'data'
				FROM remedioContinuo rc
					INNER JOIN rmcUsos s
						ON rc.idRemContinuo = s.idRemContinuo
				WHERE s.rmcHorario > TIME('now','localtime');
			`);

			if (resultTrabalho.verify == 1) {
				setPlaySound(false)
			} else {
				setPlaySound(true)
			}

			if ( inter !== resultAguaInter.interA) {
				const { interA } = resultAguaInter
				setInter(interA);

				agendarNotificacao(
					"Alarme <= Agua =>",
					'Beba água',
					{ seconds: (interA * 60), repeats: true }
				)
			}

			if (JSON.stringify(eventos) !== JSON.stringify(resultEventos)) {
				setEventos(resultEventos);

				resultEventos.forEach((eventoE) => {
					const { nome, data } = eventoE
					const dataModified = new Date(data)					
					
					agendarNotificacao(
						"Alarme <= Evento =>",
						`${nome} - ${dataModified.toLocaleTimeString().substring(0, 5)}`,
						dataModified
					)
				});
			}

			if (JSON.stringify(pet) !== JSON.stringify(resultPet)) {
				setPet(resultPet);

				resultPet.forEach(async(petE) => {
					const { nome, data } = petE
					const dataModified = new Date(data)
					
					agendarNotificacao(
						"Alarme <= Pet =>",
						`${nome} - ${dataModified.toLocaleTimeString().substring(0, 5)}`,
						dataModified
					)
				});
			}

			if (JSON.stringify(remedio) !== JSON.stringify(resultRemedio)) {
				setRemedio(resultRemedio);

				resultRemedio.forEach((value) => {
					const { nome, data } = value
					const dataModified = new Date(data)
					
					agendarNotificacao(
						"Alarme <= Remedio =>",
						`${nome} - ${dataModified.toLocaleTimeString().substring(0, 5)}`,
						dataModified
					)
				});
			}

			if (JSON.stringify(remedioC) !== JSON.stringify(resultRemedioC)) {
				setRemedioC(resultRemedioC);

				resultRemedioC.forEach(async(value) => {
					const { nome, data } = value
					const dataModified = new Date(data)
					
					agendarNotificacao(
						"Alarme <= Remedio Continuo =>",
						`${nome} - ${dataModified.toLocaleTimeString().substring(0, 5)}`,
						dataModified
					)
				});
			}
		}
		
		const interval = setInterval(() => {
			extraiDados()
		}, 20000);

		return () => clearInterval(interval);
		}, [inter, eventos, pet, remedio, remedioC]);
}
