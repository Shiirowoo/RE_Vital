import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';

const atualizarDadosRemed = async(dados) => {
    const db = useSQLiteContext()
    const { nome, quant, medida, comeco, intervalo, final, id } = dados

    const atualizarRemedio = await db.prepareAsync(`
        UPDATE remedio
        SET remNome = $nome, remQuant = $quant, remMedida = $medida, remComeco = $comeco, remIntervaloDoses = $intervalo, remFinal = $final
        WHERE idRemedio = $id;
    `);

    const deletarHorariosAntigos = await db.prepareAsync(`
        DELETE FROM remHora
        WHERE idRemedio = $id;
    `);
    
    const registrarHorarios = await db.prepareAsync(`
        WITH RECURSIVE horarios AS (
        SELECT
            idRemedio,
            remComeco AS 'remHorario'
        FROM remedio

        UNION ALL

        SELECT
            r.idRemedio,
            DATETIME(h.remHorario, '+' || r.remIntervaloDoses || ' hour') AS 'remHorario'
        FROM horarios h
        JOIN remedio r ON h.idRemedio = r.idRemedio
        WHERE DATETIME(h.remHorario, '+' || r.remIntervaloDoses || ' hour') <= r.remFinal
    )
    INSERT INTO remHora (idRemedio, remHorario)
    SELECT $id, remHorario
    FROM horarios;
    `);

    try {
        await atualizarRemedio.executeAsync({
            $nome: nome,
            $quant: quant,
            $medida: medida,
            $comeco: comeco,
            $intervalo: intervalo,
            $final: final,
            $id: id
        });
        await deletarHorariosAntigos.executeAsync({$id: id});
        await registrarHorarios.executeAsync({$id: id});
        
        Alert.alert(
            'Sucesso',
            'Remedio atualizado com sucesso',
            [
                {text: 'Voltar', onPress: () => {
                    router.back()
                }}
            ]
        );
    } finally {
        atualizarRemedio.finalizeAsync();
        deletarHorariosAntigos.finalizeAsync();
        registrarHorarios.finalizeAsync();
    }
};

export default atualizarDadosRemed;