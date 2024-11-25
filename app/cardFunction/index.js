import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CardFunction(){
    const router = useRouter();
    return (
        <View style={styles.card}>
            <Pressable onPress={() => router.push('/cardFunction/modalAgua')} style={styles.button}>
                <FontAwesome6 name="glass-water" size={40} color="#333333" />
            </Pressable>
            <Pressable onPress={() => router.push('/cardFunction/modalSono')} style={styles.button}>
                <MaterialCommunityIcons name="bell-sleep-outline" size={40} color="#333333" />
            </Pressable>
            <Pressable onPress={() => router.push('/cardFunction/modalPerson')} style={styles.button}>
            <MaterialCommunityIcons name="account" size={40} color="#333" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    button: {
        borderRadius: 10,
        backgroundColor: '#FFF',
        width: '30%',
        padding: 30,
        borderWidth: 1,
        borderColor: '#BDBDBD',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
})