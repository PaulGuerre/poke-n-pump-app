import { View, StyleSheet, Image, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themedComponents/ThemedView';
import { ThemedText } from '@/components/themedComponents/ThemedText';
import { ThemedScrollView } from '@/components/themedComponents/ThemedScrollView';
import { ThemedButton } from '@/components/themedComponents/ThemedButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { getPokeeList, sendPoke } from '@/hooks/useAPI';
import usePushNotifications from '@/hooks/usePushNotifications';
import Toast from 'react-native-root-toast';
import { incrementXp } from '@/hooks/useAPI';
import { getUser } from '@/hooks/useAsyncStorage';

interface Pokee {
    id: string;
    nickname: string;
    expoPushToken: string;
    isFriend: boolean;
    isShamePostCandidate: boolean;
}

export default function PokeList({didWorkout}) {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const { sendNotification } = usePushNotifications();

    const [showPokeModal, setShowPokeModal] = useState(false);
    const [receiverId, setReceiverId] = useState('');
    const [receiverToken, setReceiverToken] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [enableShamePost, setEnableShamePost] = useState(false);
    const [pokees, setPokees] = useState<Pokee[]>([]);
    const [friends, setFriends] = useState<Pokee[]>([]);
    const [myselfPokee, setMyselfPokee] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [myself, setMyself] = useState<Pokee>({id: '', nickname: '', expoPushToken: '', isFriend: true, isShamePostCandidate: false});
    
    useEffect(() => {
        AsyncStorage.multiGet(['id', 'nickname', 'expoPushToken']).then((res) => {
            const id = res[0][1] || '';
            const nickname = res[1][1] || '';
            const expoPushToken = res[2][1] || '';

            if (!id || !nickname || !expoPushToken) {
                return;
            }
      
            const myself = {
                id: id,
                nickname: nickname,
                expoPushToken: expoPushToken,
                isFriend: true,
                isShamePostCandidate: false
            };
            setMyself(myself);
        });
    }, []);

    useEffect(() => {
        fetchPokees();
    }, [myself]);

    useEffect(() => {
        if (didWorkout) {
            fetchPokees();
        }
    }, [didWorkout]);

    const fetchPokees = async () => {
        if (myself !== undefined && myself.id !== '') {
            const res = await getPokeeList(myself.id);
            console.log('Pokees:', res.data.map((pokee: Pokee) => pokee.nickname));
            setMyselfPokee(res.data.some((pokee: Pokee) => pokee.id === myself.id));
            setPokees(res.data.filter((pokee: Pokee) => !pokee.isFriend && pokee.id !== myself.id));
            setFriends(res.data.filter((pokee: Pokee) => pokee.isFriend && pokee.id !== myself.id));
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        console.log('Refreshing pokees');
        await fetchPokees();
        setRefreshing(false);
    };

    const pokeXpUpdate = () => {
        if (myself !== undefined && myself.id !== '') {
            incrementXp(myself.id, 10);
            Toast.show('Earned 10XP by poking a lazy gym buddy!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
            });
        }
    };

    return (
        <ThemedView style={styles.pokeListView}>
            <Modal
                transparent={true}
                visible={showPokeModal}
                onRequestClose={() => setShowPokeModal(false)}
                >
                <TouchableWithoutFeedback
                    onPress={() => setShowPokeModal(false)}
                    >
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>

                <ThemedView
                    style={styles.pokeModal}>
                    <ThemedButton
                        title="Just Poke"
                        lightColor={themeColor.mainLight}
                        darkColor={themeColor.mainLight}
                        lightBorderColor={themeColor.mainLight}
                        darkBorderColor={themeColor.mainLight}
                        onPress={() => {
                            sendPoke(myself.id, receiverId, 'Just Poke');
                            setShowPokeModal(false);
                            sendNotification(receiverToken, { title: 'PokeNPump', body: `You've been poked by ${myself.nickname}!` });
                            pokeXpUpdate();
                            fetchPokees();
                        }}
                    />
                    <ThemedButton
                        title="Join Me!"
                        lightColor={themeColor.mainLight}
                        darkColor={themeColor.mainLight}
                        lightBorderColor={themeColor.mainLight}
                        darkBorderColor={themeColor.mainLight}
                        onPress={() => {
                            sendPoke(myself.id, receiverId, 'Join Me');
                            setShowPokeModal(false);
                            sendNotification(receiverToken, { title: 'PokeNPump', body: `Join ${myself.nickname} in a workout!` });
                            pokeXpUpdate();
                            fetchPokees();
                        }}
                    />
                    <ThemedButton
                        title="Trash Talk"
                        lightColor={themeColor.mainLight}
                        darkColor={themeColor.mainLight}
                        lightBorderColor={themeColor.mainLight}
                        darkBorderColor={themeColor.mainLight}
                        onPress={() => {
                            sendPoke(myself.id, receiverId, 'Trash Talk');
                            setShowPokeModal(false);
                            sendNotification(receiverToken, { title: 'PokeNPump', body: `${receiverName} : go hit the gym you fat looser!` });
                            pokeXpUpdate();
                            fetchPokees();
                        }}
                    />
                    { enableShamePost ?
                        <ThemedButton
                        title="Shame Post"
                        onPress={() => {
                            router.navigate('/(shamePost)');
                            setShowPokeModal(false);
                        }}
                        /> : null
                    }
                    
                </ThemedView>
            </Modal>
            { isLoading ? 
            <ActivityIndicator color={themeColor.default} style={{ height: "70%" }} /> : 
            <ThemedScrollView 
                style={styles.pokeesContainer} 
                showsVerticalScrollIndicator={false} 
                refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColor.default}/> }
            >
                { didWorkout
                ? <ThemedText style={styles.myselfPlaceholder} type="subtitle">You've worked out today!</ThemedText>
                : !myselfPokee
                    ? <ThemedText style={styles.myselfPlaceholder} type="subtitle">You've poked yourself today!</ThemedText>
                    : <>
                        <ThemedText type="subtitle">You!</ThemedText>
                        <Pressable 
                            onPress={() => {
                                if (!myself) return;
                                setShowPokeModal(true);
                                setReceiverToken(myself.expoPushToken);
                                setReceiverId(myself.id);
                                setReceiverName(myself.nickname);
                                setEnableShamePost(myself.isShamePostCandidate);
                            }}
                        >
                            <ThemedView
                                style={styles.pokeeContainer}
                                lightColor={myself.isShamePostCandidate ? themeColor.subLight : themeColor.mainLight}
                                darkColor={myself.isShamePostCandidate ? themeColor.subLight : themeColor.mainLight}
                                lightBorderColor={myself.isShamePostCandidate ? themeColor.subDark : themeColor.mainDark}
                                darkBorderColor={myself.isShamePostCandidate ? themeColor.subDark : themeColor.mainDark}
                            >
                                <ThemedText type='default' lightColor={themeColor.reverse} darkColor={themeColor.reverse}>{myself.nickname}</ThemedText>
                            </ThemedView>
                        </Pressable>
                    </>
                }
                <ThemedText type="subtitle">Friends</ThemedText>
                { (!friends.length) ? <ThemedText type='default'>No friends to poke :/</ThemedText> : friends.map((friend, index) => (
                    <Pressable 
                        key={index}
                        onPress={() => {
                            if (!myself) return;
                            setShowPokeModal(true);
                            setReceiverToken(friend.expoPushToken);
                            setReceiverId(friend.id);
                            setReceiverName(friend.nickname);
                            setEnableShamePost(friend.isShamePostCandidate);
                        }}
                    >
                        <ThemedView
                            key={index}
                            style={styles.pokeeContainer}
                            lightColor={friend.isShamePostCandidate ? themeColor.subLight : themeColor.mainLight}
                            darkColor={friend.isShamePostCandidate ? themeColor.subLight : themeColor.mainLight}
                            lightBorderColor={friend.isShamePostCandidate ? themeColor.subDark : themeColor.mainDark}
                            darkBorderColor={friend.isShamePostCandidate ? themeColor.subDark : themeColor.mainDark}
                        >
                            <ThemedText type='default' lightColor={themeColor.reverse} darkColor={themeColor.reverse}>{friend.nickname}</ThemedText>
                        </ThemedView>
                    </Pressable>
                )) }
                <ThemedText type='subtitle'>Pokees</ThemedText>
                { (!pokees) ? <ThemedText type='default'>No pokees available :/</ThemedText> : pokees.map((pokee, index) => (
                    <Pressable 
                        key={index}
                        onPress={() => {
                            if (!myself) return;
                            setShowPokeModal(true);
                            setReceiverToken(pokee.expoPushToken);
                            setReceiverId(pokee.id);
                            setReceiverName(pokee.nickname);
                            setEnableShamePost(pokee.isShamePostCandidate);
                        }}
                    >
                        <ThemedView
                            style={styles.pokeeContainer}
                            lightColor={pokee.isShamePostCandidate ? themeColor.subLight : themeColor.mainLight}
                            darkColor={pokee.isShamePostCandidate ? themeColor.subLight : themeColor.mainLight}
                            lightBorderColor={pokee.isShamePostCandidate ? themeColor.subDark : themeColor.mainDark}
                            darkBorderColor={pokee.isShamePostCandidate ? themeColor.subDark : themeColor.mainDark}
                        >
                            <ThemedText type='default' lightColor={themeColor.reverse} darkColor={themeColor.reverse}>{pokee.nickname}</ThemedText>
                        </ThemedView>
                    </Pressable>
                )) }
            </ThemedScrollView> }
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    pokeListView: {
        height: '70%',
        width: '90%',
        alignItems: 'center',
        marginBottom: 5,
    },
    pokeesContainer: {
        width: '100%',
    },
    pokeeContainer: {
        margin: 5,
        padding: 10,
        borderWidth: 5,
        borderRadius: 10,
    },
    pokeModal: {
        position: 'absolute',
        height: 300,
        width: 200,
        marginTop: -150,
        marginLeft: -100,
        top: '50%',
        left: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        borderRadius: 20
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    myselfPlaceholder: {
        marginBottom: 30,
    }
});
