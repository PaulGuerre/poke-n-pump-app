import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import ProfileInfos from '@/components/login/ProfileInfos';
import VisibilityOption from '@/components/login/VisibilityOption';
import WorkoutInfos from '@/components/login/WorkoutInfos';
import ThemedButton from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import ShameOption from '@/components/login/ShameOption';
import { USER_URL } from '@/constants/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usePushNotifications from '@/hooks/usePushNotifications';

enum LOGIN_STAGE {
  PROFILE = 'PROFILE',
  VISIBILITY = 'VISIBILITY',
  WORKOUT = 'WORKOUT',
  SHAME = 'SHAME'
}

export default function LoginScreen() {
  const [stage, setStage] = useState<LOGIN_STAGE>(LOGIN_STAGE.PROFILE);

  const notificationToken = usePushNotifications().expoPushToken;

  function finishOnboarding() {
    router.replace('/(tabs)')
    fetch(USER_URL, {
      method: 'POST',
      body: JSON.stringify({
        nickname: 'john_doe',
        workoutPlan: {
          daysOfWeek: [1, 3, 5]
        },
        shamePostSetting: {
          isEnabled: true,
          noGymStreak: 2
        },
        profilePicture: null,
        notificationToken
      })
    }).then((response) => response.json())
    .then((data) => {
      if (data.error == true) {
        console.log('Error creating user');
        return;
      }
      AsyncStorage.setItem('user_info', JSON.stringify(data.response.body));
    });
  }

  return (
    <ThemedView style={styles.container}  >
      {
        stage === LOGIN_STAGE.PROFILE ? 
        <ProfileInfos /> : 
        stage === LOGIN_STAGE.VISIBILITY ? 
        <VisibilityOption /> : 
        stage === LOGIN_STAGE.WORKOUT ? 
        <WorkoutInfos /> : <ShameOption />
      }
      <ThemedButton 
        title="Complete" 
        onPress={() => {
          stage === LOGIN_STAGE.PROFILE ? setStage(LOGIN_STAGE.VISIBILITY) :
          stage === LOGIN_STAGE.VISIBILITY ? setStage(LOGIN_STAGE.WORKOUT) :
          stage === LOGIN_STAGE.WORKOUT ? setStage(LOGIN_STAGE.SHAME) :
          finishOnboarding();
        }} 
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
