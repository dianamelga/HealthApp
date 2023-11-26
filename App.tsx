import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {PaperProvider, useTheme} from 'react-native-paper';

import {AppleHealthProvider} from './src/modules/applehealth/AppleHealthContext';
import AppleHealthScreen from './src/screens/AppleHealthScreen';

export default function App() {
  const theme = useTheme();
  return (
    <>
      <AppleHealthProvider>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <AppleHealthScreen />
          </SafeAreaView>
        </PaperProvider>
      </AppleHealthProvider>
    </>
  );
}
