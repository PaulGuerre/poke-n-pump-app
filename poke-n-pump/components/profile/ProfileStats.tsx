import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileStats() {
    const colorScheme = useColorScheme();
    const [numStreak, setNumStreak] = useState(0);
    const [numShamePost, setNumShamePost] = useState(0);
    const [numPoke, setNumPoke] = useState(0);

    const themeColor = Colors[colorScheme ?? 'light'];

    return (
        <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.stats} lightColor={themeColor.default} darkColor={themeColor.default} lightBorderColor={themeColor.subLight} darkBorderColor={themeColor.subLight}>
                <Ionicons name="flame" size={40} color={themeColor.subDark} />
                <ThemedText type="default" lightColor={themeColor.reverse} darkColor={themeColor.reverse}>{numStreak} days streak</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stats} lightColor={themeColor.default} darkColor={themeColor.default} lightBorderColor={themeColor.mainLight} darkBorderColor={themeColor.subLight}>
                <Ionicons name="logo-instagram" size={40} color={themeColor.mainDark} />
                <ThemedText type="default" lightColor={themeColor.reverse} darkColor={themeColor.reverse}>{numShamePost} shame posts</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stats} lightColor={themeColor.default} darkColor={themeColor.default} lightBorderColor={themeColor.backgroundLight} darkBorderColor={themeColor.subLight}>
                <Ionicons name="alert" size={40} color={themeColor.reverse} />
                <ThemedText type="default" lightColor={themeColor.reverse} darkColor={themeColor.reverse}>{numPoke} pokes</ThemedText>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    statsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        width: '90%',
    },
    stats: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        width: 250,
        height: 50,
        borderRadius: 10,
        borderWidth: 2.5
    }
});
