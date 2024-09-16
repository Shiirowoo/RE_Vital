const { Tabs } = require("expo-router");
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Router(){
    return(
        <Tabs initialRouteName="index"
        screenOptions={{
            headerShown: false
        }}>
            <Tabs.Screen name="remedio" options={{
                title: "Remédio",
                tabBarIcon: ({color}) => <MaterialCommunityIcons name="pill" size={22} color={color} />,
                tabBarActiveTintColor: 'darkblue',
                tabBarInactiveTintColor: 'gray',

            }}/>
            <Tabs.Screen name="agua" options={{
                title: "Água",
                tabBarIcon: ({color}) => <Ionicons name="water" size={28} color={color} />,
                tabBarActiveTintColor: 'darkblue',
                tabBarInactiveTintColor: 'gray',
            }}/>
            <Tabs.Screen name="index" options={{
                title: "Home",
                tabBarIcon: ({color}) => <Entypo name="home" size={32} color={color} />,
                tabBarActiveTintColor: 'darkblue',
                tabBarInactiveTintColor: 'gray',
            }}/>
            <Tabs.Screen name="sono" options={{
                title: "Dormir",
                tabBarIcon: ({color}) => <MaterialCommunityIcons name="sleep" size={28} color={color} />,
                tabBarActiveTintColor: 'darkblue',
                tabBarInactiveTintColor: 'gray',
            }}/>
            <Tabs.Screen name="pet" options={{
                title: "Pet",
                tabBarIcon: ({color}) => <MaterialCommunityIcons name="dog" size={22} color={color} />,
                tabBarActiveTintColor: 'darkblue',
                tabBarInactiveTintColor: 'gray',
            }}/>
        </Tabs>
    )
}