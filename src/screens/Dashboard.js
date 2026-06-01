import { LinearGradient } from "expo-linear-gradient";
import { BarChart } from "react-native-gifted-charts";
import styles from '../styles/Dashboard.styles'

export default function DashboardPage(){
    return(
        <LinearGradient 
        style={styles.container}
        colors={"#000000", "#313ad9"}>
            <BarChart />
        </LinearGradient>
    );
}