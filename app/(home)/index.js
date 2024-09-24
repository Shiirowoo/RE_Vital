import { SafeAreaView } from "react-native-safe-area-context";
import CardWater from "./components/cardWater";
import CardEvento from './components/cardEvent';
import CardSleep from "./components/cardSleep";

//Link paleta: https://paletadecores.com/paleta/2710f2/1d0ce3/1308d3/0a04c4/0000b4/

export default function index(){
    return (
        <SafeAreaView>
            <CardSleep />
            <CardWater />
            <CardEvento />
        </SafeAreaView>
    )
}