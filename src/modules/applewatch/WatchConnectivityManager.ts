/**
 * This exposes the native WatchConnectivity module as a JS module.
 */
import {NativeEventEmitter, NativeModules} from 'react-native';
const {WatchConnectivityModule} = NativeModules;

interface WatchConnectivityInterface {
  sendMessage(message: string): void;
}

const WatchConnectivityManager =
  WatchConnectivityModule as WatchConnectivityInterface;

export const WatchConnectivityEvents = new NativeEventEmitter(
  WatchConnectivityModule,
);

export default WatchConnectivityManager;
