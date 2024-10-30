import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useState, useEffect } from "react";
import { Platform } from "react-native";

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
    const [ expoPushToken, setExpoPushToken ] = useState('')

    useEffect(() => {
        PushNotifications().then(token => setExpoPushToken(token));
    },[]);
}