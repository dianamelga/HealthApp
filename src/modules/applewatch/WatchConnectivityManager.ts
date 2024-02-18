/**
 * This exposes the native WatchConnectivity module as a JS module.
 */
import {NativeEventEmitter, NativeModules} from 'react-native';
const {WatchConnectivityModule} = NativeModules;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type WatchConnectivityEvent =
  | 'bpm'
  | 'kcal'
  | 'workoutState'
  | 'elapsedTime'
  | 'onNotificationMessageChanged';

export type WatchConnectivityEventType = keyof typeof WatchConnectivityEvents;

interface WatchConnectivityInterface {
  sendMessage(message: string): void;
  updateWorkoutState(workoutState: string): void;
}

const WatchConnectivityManager =
  WatchConnectivityModule as WatchConnectivityInterface;

export const WatchConnectivityEvents = new NativeEventEmitter(
  WatchConnectivityModule,
);

export default WatchConnectivityManager;
