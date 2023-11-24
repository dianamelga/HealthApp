import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

import {AppleHealthProvider} from './src/modules/applehealth/AppleHealthContext';
import AppleHealthScreen from './src/screens/AppleHealthScreen';

export default function App() {
  return (
    <>
      <AppleHealthProvider>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <AppleHealthScreen />
        </SafeAreaView>
      </AppleHealthProvider>
    </>
  );
}
