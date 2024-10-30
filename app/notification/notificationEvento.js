import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async() => ({

        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false

    })
})

async function agendarNotificacao(){
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Notificação Local 📬",
            body: "Esta é uma notificação de teste!",
            sound: true,
        },
        trigger: { seconds: 5 }, 
    });
}


