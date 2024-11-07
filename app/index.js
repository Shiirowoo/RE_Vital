import { SafeAreaView } from "react-native-safe-area-context";
import CardWater from "./components/(cardAgua)";
import CardEvento from './components/(cardEvento)';
import CardSleep from "./components/(cardSono)";
import CardRemed from "./components/(cardRemed)";
import CardPet from "./components/(cardPet)";
import { ScrollView } from "react-native";

//Link paleta: https://paletadecores.com/paleta/2710f2/1d0ce3/1308d3/0a04c4/0000b4/

export default function index(){

    return (
        <SafeAreaView>
            <ScrollView>
                <CardSleep />
                <CardWater />
                <CardEvento />
                <CardRemed />
                <CardPet />
            </ScrollView>
        </SafeAreaView>
    )
}
