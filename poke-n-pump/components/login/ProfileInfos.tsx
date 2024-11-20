import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileInfos() {
    const colorScheme = useColorScheme();
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState('');	

    const themeColor = Colors[colorScheme ?? 'light'];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const saveUsername = async () => {
        console.log("Username : " + username);

        if (username === null || username === '') {
            return;
        }

        try {
            await AsyncStorage.setItem('username', username);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <ThemedView style={styles.profileView}>
            <ThemedText type="title">Welcome to{" "}
                <ThemedText 
                    type="title" 
                    lightColor={themeColor.sub} 
                    darkColor={themeColor.sub}>
                    Poke
                </ThemedText>
                &
                <ThemedText
                    type="title" 
                    lightColor={themeColor.sub} 
                    darkColor={themeColor.sub}>
                    Pump
                </ThemedText>
                !
            {"\n"}Let me know about you.</ThemedText>
            { image ? <Image source={{ uri: image }} style={styles.image} /> : <Ionicons name="person-circle" size={150} color="white" onPress={pickImage} /> }
            <ThemedView style={styles.username}>
                <ThemedText type='subtitle' lightColor={themeColor.default} darkColor={themeColor.default}>Nickname</ThemedText>
                <ThemedView style={styles.usernameInput}>
                    <ThemedTextInput onChangeText={setUsername} />
                    <ThemedButton 
                        title="Check"
                        style={styles.checkButton}
                        onPress={() => {
                            saveUsername();
                        }} 
                    />
                </ThemedView>
            </ThemedView> 
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    profileView: {
        height: '40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        width: 125,
        height: 125,
        borderRadius: 100,
    },
    username: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
    },
    usernameInput: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
    },
    checkButton: {
        width: 100
    }
});
