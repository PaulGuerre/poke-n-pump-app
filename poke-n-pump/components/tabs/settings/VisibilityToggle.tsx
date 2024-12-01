import { StyleSheet } from 'react-native';
import { ThemedView } from '../../themedComponents/ThemedView';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../themedComponents/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VisibilityToggle({orientation}) {
    const colorScheme = useColorScheme();

    const themeColor = Colors[colorScheme ?? 'light'];

    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    useEffect(() => {
        loadVisibility();
    }, []);

    const loadVisibility = async () => {
        try {
            const visibilityString = await AsyncStorage.getItem('visibility');
            const visibility = visibilityString !== null ? visibilityString : 'friend';
            setIsPrivate(visibility === 'friend');
        } catch (e) {
            console.error(e);
        }
    }

    const storeVisibility = async (visibility: string) => {
        try {
            await AsyncStorage.setItem('visibility', visibility);
        } catch (e) {
            console.error(e);
        }
    }

    const styles = StyleSheet.create({
        visibilityView: {
            display: 'flex',
            flexDirection: orientation,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
        },
        optionView: {
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            padding: 10,
            width: 150,
            borderWidth: 2.5,
            borderRadius: 10,
        }
    });

    return (
        <ThemedView style={styles.visibilityView}>
            <ThemedView 
                style={styles.optionView} 
                lightColor={themeColor.default} 
                darkColor={themeColor.default}
                lightBorderColor={isPrivate ? themeColor.main : themeColor.default}
                darkBorderColor={isPrivate ? themeColor.main : themeColor.default}
                onPress={() => {
                    setIsPrivate(true);
                    storeVisibility('friend');
                }}>
                <Ionicons name="person" size={24} color={themeColor.reverse} />
                <ThemedText lightColor={themeColor.reverse} darkColor={themeColor.reverse}>Friends</ThemedText>
            </ThemedView>
            <ThemedView 
                style={styles.optionView}
                lightColor={themeColor.default}
                darkColor={themeColor.default}
                lightBorderColor={!isPrivate ? themeColor.main : themeColor.default}
                darkBorderColor={!isPrivate ? themeColor.main : themeColor.default}
                onPress={() => {
                    setIsPrivate(false);
                    storeVisibility('global');
                }}>
                <Ionicons name="earth" size={24} color={themeColor.reverse} />
                <ThemedText lightColor={themeColor.reverse} darkColor={themeColor.reverse}>Anyone</ThemedText>
            </ThemedView>
        </ThemedView>
    );
}
