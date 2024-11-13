import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";

const atualizarDadosRemedC = async(dados) => {
    const db = useSQLiteContext();
    const router = useRouter();

    const { idUsos, quant, medida, horario, nome, id } = dados
    const atualizarNomeRemedio = await db.prepareAsync(`
        UPDATE remedioContinuo
        SET remcNome = $nome
        WHERE remcNome != $nome;
    `);

    const atualizarUsos = await db.prepareAsync(`
        UPDATE rmcUsos 
        SET rmcQuant = $quant, rmcMedida = $medida, rmcHorario = $horario
        WHERE idUsos = $idUsos;
    `);
    
    const adicionarNovosUsos = await db.prepareAsync(`
        INSERT INTO rmcUsos (rmcQuant, rmcMedida, rmcHorario, idRemContinuo)
        SELECT $quant, $medida, $horario, $idRemContinuo
        WHERE (SELECT COUNT(*) FROM rmcUsos WHERE idUsos = $idUsos) = 0;
    `);

    try {
        for (let i = 0; i < idUsos.length; i++) {
            const idUsosIndex = idUsos[i];
            const horarioIndex = horario[i];
            const quantIndex = quant[i];
            const medidaIndex = medida[i];

            await atualizarNomeRemedio.executeAsync({$nome: nome});
            await atualizarUsos.executeAsync({
                $idUsos: idUsosIndex,
                $quant: quantIndex,
                $medida: medidaIndex,
                $horario: horarioIndex,
                $id: id
            });
            
            await adicionarNovosUsos.executeAsync({
                $idUsos: idUsosIndex,
                $quant: quantIndex,
                $medida: medidaIndex,
                $horario: horarioIndex,
                $idRemContinuo: id
            });

        }
        Alert.alert(
            'Sucesso',
            'Remedio registrado com sucesso',
            [
                {text: 'Voltar', onPress: () => {
                    router.back()
                }}
            ]
        );
        
    } finally {
        await atualizarNomeRemedio.finalizeAsync();
        await atualizarUsos.finalizeAsync();
        await adicionarNovosUsos.finalizeAsync();
    }
};
