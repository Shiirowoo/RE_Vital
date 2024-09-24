const { Tabs } = require("expo-router");
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Router(){
    const color = "#0000b4"
    return(
        <Tabs initialRouteName="(home)"
        screenOptions={{
            headerShown: false
        }}>                                                                                                                                                                            
            <Tabs.Screen name="(agua)" options={{
                title: "Água",
                tabBarIcon: ({color}) => <Ionicons name="water" size={28} color={color} />,
                tabBarActiveTintColor: color,
                tabBarInactiveTintColor: 'gray',
            }}/>
            <Tabs.Screen name="(home)" options={{
                title: "Home",
                tabBarIcon: ({color}) => <Entypo name="home" size={32} color={color} />,
                tabBarActiveTintColor: color,
                tabBarInactiveTintColor: 'gray',
            }}/>
            <Tabs.Screen name="(sono)" options={{
                title: "Dormir",
                tabBarIcon: ({color}) => <MaterialCommunityIcons name="sleep" size={28} color={color} />,
                tabBarActiveTintColor: color,
                tabBarInactiveTintColor: 'gray',
            }}/>
        </Tabs>
    )
}