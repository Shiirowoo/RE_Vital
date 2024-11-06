import { View, Switch, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import RemedioContinuo from './regRemedioContinuo';
import Remedio from './regRemedio';

export default function registraRemed(){
    const [isEnable, setIsEnable] = useState(false)
    const toggleSwitch = () => setIsEnable(previousState => !previousState)

    return (
        <View>
            <Switch
            trackColor={{false: '#dfdfdf', true: '#2710f2'}}
            thumbColor={isEnable ? '#0000b4' : '#c0c0c0'}  
            onValueChange={toggleSwitch}
            value={isEnable}
            />
            <RenderSwitch change={isEnable}/>
        </View>
    )
}

function RenderSwitch({change: Enable}){
    if (Enable){
        return (
            <RemedioContinuo />
        )
    }
    return (
        <Remedio />
    )
}