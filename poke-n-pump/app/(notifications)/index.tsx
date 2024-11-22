import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image, StyleSheet } from "react-native";
import notification from '@/assets/images/notification.png';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { acceptFriendRequest, getReceivedRequests } from "@/hooks/useAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePushNotifications from "@/hooks/usePushNotifications";

export default function NotificationsScreen() {
    const colorScheme = useColorScheme();

    const themeColor = Colors[colorScheme ?? 'light'];

    const notifications = [
        {
            user: 'Paul',
            message: 'poked you ;)',
            type: 'poke'
        },
        {
            user: 'Paul',
            message: 'poked you to Join',
            type: 'join'
        },
        {
            user: 'Paul',
            message: 'shame posted you',
            type: 'shame'
        },
        {
            user: 'Paul',
            message: 'looks down on ya',
            type: 'poke'
        },
        {
            user: 'Paul',
            message: 'poked you ;)',
            type: 'poke'
        },
        {
            user: 'Paul',
            message: 'shame posted you',
            type: 'shame'
        },
    ]

    const determineColor = (type: String) => {
        switch (type) {
            case 'poke':
                return themeColor.default;
            case 'join':
                return themeColor.subLight;
            case 'shame':
                return themeColor.mainLight;
            default:
                return themeColor.default;
        }
    }

    const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
    const { expoPushToken, sendNotification } = usePushNotifications();

    useEffect(() => {
        AsyncStorage.getItem('id').then((userId) => {
            if (userId) {
                getReceivedRequests(userId).then((res) => {
                    if (Array.isArray(res.data)) {
                        setReceivedRequests(res.data.filter((request) => request.status === 'pending'));
                    } else {
                        console.error("Unexpected data format:", res.data);
                    }
                });
            }
        });
    }, []);

    const handleAccept = (requestId: string, nickname: string) => {
        acceptFriendRequest(requestId).then((res) => {
            if (res.status === 200) {
                setReceivedRequests(receivedRequests.filter((request) => request.id !== requestId));
                sendNotification(expoPushToken, { title: 'Friend Request Accepted', body: `${nickname} is now your friend!` });
            }
        });
    }

    return (
        <ThemedView style={styles.notificationsView}>
            <ThemedView style={styles.backNavigation} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={75} color={themeColor.main} />
                <Image source={notification} style={styles.backImage} />
            </ThemedView>
            <ThemedView style={styles.notificationsContainer}>
                {receivedRequests.map((request, index) => (
                    <ThemedView 
                    key={index} 
                    lightColor={determineColor(notification.type)}
                    darkColor={determineColor(notification.type)}
                    style={styles.notification}>
                        <ThemedText style={{textAlign: 'left'}} lightColor={themeColor.reverse} darkColor={themeColor.reverse}>
                            {request.senderNickname} sent you a friend requesttt
                        </ThemedText>
                        <ThemedView 
                        lightColor={determineColor(notification.type)}
                        darkColor={determineColor(notification.type)}
                        style={styles.friendRequestButtons}>
                            <ThemedText 
                            type='default' 
                            lightColor={themeColor.reverse} 
                            darkColor={themeColor.reverse}
                            onPress={() => { handleAccept(request.id, request.senderNickname)}}>
                                Accept
                            </ThemedText>
                            <ThemedText type='default' lightColor={themeColor.reverse} onPress={() => {}}>Reject</ThemedText>
                        </ThemedView>
                    </ThemedView>
                ))}
                {notifications.map((notification, index) => (
                    <ThemedView 
                    key={index} 
                    lightColor={determineColor(notification.type)}
                    darkColor={determineColor(notification.type)}
                    style={styles.notification}
                    >
                        <ThemedText style={{textAlign: 'left'}} lightColor={themeColor.reverse} darkColor={themeColor.reverse}>
                            {notification.user} {notification.message}
                        </ThemedText>
                    </ThemedView>
                ))}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    notificationsView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    backNavigation: {
        width: '100%',
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backImage: {
        width: 200,
        height: undefined,
        aspectRatio: 272 / 130,
        resizeMode: 'contain',
    },
    notificationsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notification: {
        width: 300,
        padding: 10,
        borderRadius: 10,
    },
    friendRequestButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});
