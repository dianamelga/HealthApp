import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {PaperProvider, useTheme} from 'react-native-paper';

import {AppleHealthProvider} from './src/modules/applehealth/AppleHealthContext';
import AppleHealthScreen from './src/screens/apple-health/AppleHealthScreen';
import SplashScreen from './src/screens/splash/SplashScreen';
import {WorkoutManagerProvider} from 'modules/workout-manager/WorkoutManagerContext';

export default function App() {
  const theme = useTheme();
  return (
    <>
      <AppleHealthProvider>
        <WorkoutManagerProvider>
          <PaperProvider theme={theme}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{flex: 1}}>
              <AppleHealthScreen />
            </SafeAreaView>
          </PaperProvider>
        </WorkoutManagerProvider>
      </AppleHealthProvider>
    </>
  );
}
