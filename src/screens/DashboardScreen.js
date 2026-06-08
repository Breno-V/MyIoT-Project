import React from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart } from 'react-native-chart-kit';
import styles from '../styles/Dashboard.styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 64;
const MS_PER_MIN = 60_000;
const MAX_SENSOR_POINTS = 6;

// --- Funções puras de transformação ---

const toTimeLabel = (timestamp) => {
    // converte o timestamp para um formato de hora:minuto, usado como label nos gráficos
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const toDurationLabel = (minutosTotais) => {
    if (minutosTotais < 60) return `${minutosTotais} min`;

    const horas = Math.floor(minutosTotais / 60);
    const mins = minutosTotais % 60;

    return mins === 0 ? `${horas}h` : `${horas}h ${mins}min`;
};

const sortByTime = (list) => {
    // retorna uma nova lista ordenada por timestamp, do mais antigo para o mais recente
    return [...list].sort((anterior, atual) => new Date(anterior.timestamp) - new Date(atual.timestamp));
};

const filterStateChanges = (list) => {
    // retorna uma nova lista contendo apenas os momentos em que o estado da luz mudou
    return list.filter((item, i) => i === 0 || item.light !== list[i - 1].light);
};

const calcLightTime = (history) => {
    const changes = filterStateChanges(sortByTime(history));
    let minsOn = 0;
    let minsOff = 0;

    if (changes.length === 0) return { minsOn: 0, minsOff: 0 };

    for (let i = 0; i < changes.length; i++) {
        const atual = changes[i];
        let proximoTimestamp;

        // Se houver um próximo estado, calcula o intervalo até ele. 
        // Se for o último da lista, calcula a duração contínua até o momento atual (agora).
        // Se não, o estado atual é considerado contínuo até agora, e o tempo é calculado com base nisso.
        if (i < changes.length - 1) {
            proximoTimestamp = new Date(changes[i + 1].timestamp);
        } else {
            proximoTimestamp = new Date();
        }

        const intervalo = proximoTimestamp - new Date(atual.timestamp);

        if (atual.light === '1') {
            minsOn += intervalo;
        } else {
            minsOff += intervalo;
        }
    }

    return {
        // arredonda e converte o tempo total em minutos para cada estado
        minsOn: Math.round(minsOn / MS_PER_MIN),
        minsOff: Math.round(minsOff / MS_PER_MIN),
    };
};

const buildChartDataset = (data, color) => ({
    data,
    color: (opacity = 1) => color.replace('1)', `${opacity})`),
    strokeWidth: 3,
});

const buildSensorChart = (history, key, color) => {
    const cronologico = [...history].reverse();
    const comDados = cronologico.filter(item => item[key] !== null);

    const pontos = comDados.slice(-MAX_SENSOR_POINTS);
    const valores = pontos.map(item => item[key]);

    return {
        labels: pontos.map((item) => { return toTimeLabel(item.timestamp) }),
        datasets: [buildChartDataset(valores, color)],
        isEmpty: pontos.length === 0,
    };
};

// --- Configs de gráfico ---

const BASE_CHART_CONFIG = {
    backgroundColor: '#1e293b',
    backgroundGradientFrom: '#1e293b',
    backgroundGradientTo: '#0f172a',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(248, 250, 252, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2' },
};

const CHART_STYLE = { marginVertical: 8, borderRadius: 12 };

const SectionCard = ({ title, children, icon, color }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            {icon && <Icon name={icon} size={24} color={color} />}
            <Text style={styles.tituloSecao}>{title}</Text>
        </View>
        {children}
    </View>
);

const EmptyState = ({ message }) => (
    <Text style={styles.txtSemDados}>{message}</Text>
);

export default function DashboardScreen({ route, navigation }) {
    const { history = [] } = route.params || {};

    const tempChart = buildSensorChart(history, 'temp', 'rgba(239, 68, 68, 1)');
    const humChart = buildSensorChart(history, 'hum', 'rgba(59, 130, 246, 1)');

    const { minsOn, minsOff } = calcLightTime(history);
    const hasLightData = history.length > 0 && (minsOn > 0 || minsOff > 0);

    const lightPieData = [
        {
            name: `Ativo (${toDurationLabel(minsOn)})`,
            time: minsOn,
            color: 'rgba(234, 179, 8, 1)',
            legendFontColor: '#94a3b8',
            legendFontSize: 13
        },
        {
            name: `Inativo (${toDurationLabel(minsOff)})`,
            time: minsOff,
            color: 'rgba(100, 116, 139, 1)',
            legendFontColor: '#94a3b8',
            legendFontSize: 13
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <Text style={styles.tituloGeral}>Dashboard de Análise</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Icon name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <SectionCard key="light" title={"Tempo da Luz"} icon={"lightbulb"} color={"rgba(234, 179, 8, 1)"}>
                    {hasLightData ? (
                        <View style={{ alignItems: 'center' }}>
                            <PieChart
                                data={lightPieData}
                                width={CHART_WIDTH}
                                height={180}
                                chartConfig={BASE_CHART_CONFIG}
                                // "accessor" quer dizer o campo que será utilizado para calcular os valores do gráfico
                                accessor="time"
                                backgroundColor="transparent"
                                paddingLeft={(CHART_WIDTH / 4).toString()}
                                hasLegend={false}
                                style={CHART_STYLE}
                            />
                            <View style={styles.containerLegenda}>
                                {lightPieData.map((item, index) => (
                                    <View key={index} style={styles.itemLegenda}>
                                        <View style={[styles.indicadorCor, { backgroundColor: item.color }]} />
                                        <Text style={[styles.txtLegenda, { color: item.legendFontColor, fontSize: item.legendFontSize }]}>
                                            {item.name}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <EmptyState message={"Sem dados de iluminação."} />
                    )}
                </SectionCard>

                <SectionCard key="temp" title={"Variação da Temperatura (°C)"} icon={"thermometer"} color={"rgba(239, 68, 68, 1)"}>
                    {!tempChart.isEmpty ? (
                        <LineChart
                            data={tempChart}
                            width={CHART_WIDTH}
                            height={220}
                            chartConfig={BASE_CHART_CONFIG}
                            yAxisSuffix="°C"
                            bezier
                            style={CHART_STYLE}
                        />
                    ) : (
                        <EmptyState message={"Aguardando leituras de temperatura..."} />
                    )}
                </SectionCard>

                <SectionCard key="hum" title={"Variação da Umidade (%)"} icon={"water-percent"} color={"rgba(59, 130, 246, 1)"}>
                    {!humChart.isEmpty ? (
                        <LineChart
                            data={humChart}
                            width={CHART_WIDTH}
                            height={220}
                            chartConfig={BASE_CHART_CONFIG}
                            yAxisSuffix="%"
                            bezier
                            style={CHART_STYLE}
                        />
                    ) : (
                        <EmptyState message={"Aguardando leituras de umidade..."} />
                    )}
                </SectionCard>

            </ScrollView>
        </SafeAreaView >
    );
}