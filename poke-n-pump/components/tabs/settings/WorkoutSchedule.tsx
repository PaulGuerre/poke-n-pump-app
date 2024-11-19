import { StyleSheet } from 'react-native';
import { ThemedView } from '../../ThemedView';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from 'expo-router/build/global-state/router-store';

interface IWorkoutSchedule {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
}

interface IWorkoutSession {
    day: string;
    workoutSession: boolean;
    color?: string;
}

export default function WorkoutSchedule() {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];
    const emptySchedule = {
        "mon": false,
        "tue": false,
        "wed": false,
        "thu": false,
        "fri": false,
        "sat": false,
        "sun": false
    };

    const [workoutSchedule, setWorkoutSchedule] = useState([
        { day: 'S', workoutSession: emptySchedule.mon, color: 'red' },
        { day: 'M', workoutSession: emptySchedule.tue },
        { day: 'T', workoutSession: emptySchedule.wed },
        { day: 'W', workoutSession: emptySchedule.thu },
        { day: 'T', workoutSession: emptySchedule.fri },
        { day: 'F', workoutSession: emptySchedule.sat },
        { day: 'S', workoutSession: emptySchedule.sun, color: 'blue' },
    ]);

    const toggleWorkoutSession = (index: number) => {
        setWorkoutSchedule((prevSchedule) =>
        prevSchedule.map((session, i) =>
            i === index ? { ...session, workoutSession: !session.workoutSession } : session
        )
        );
    };

    return (
        <ThemedView>
            <ThemedText type='subtitle'>Workout Schedule</ThemedText>
            <ThemedView style={styles.workoutSchedule} lightBorderColor={themeColor.mainDark} darkBorderColor={themeColor.mainDark}>
                {workoutSchedule.map((session, index) => (
                    <ThemedView key={index}>
                        <ThemedText type='title' lightColor={session.color}>{session.day}</ThemedText>
                        <Ionicons 
                        name={session.workoutSession ? 'checkbox-outline' : 'stop-outline'} 
                        size={50} color={themeColor.sub} 
                        onPress={() => toggleWorkoutSession(index) }/>
                    </ThemedView>
                ))}
            </ThemedView>
        </ThemedView> 
    );
}

const styles = StyleSheet.create({
    workoutSchedule: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderRadius: 20,
        padding: 10,
    }
});
