import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import IconView from "../components/sono/iconView"

export default function index(){
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold
      });
    
      if (!fontsLoaded) {
        return null;
      }

    return (
        <SafeAreaView>
            <IconView />
        </SafeAreaView> 
    )
}