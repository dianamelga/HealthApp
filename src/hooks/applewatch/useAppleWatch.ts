import {useEffect, useState} from 'react';
import WatchConnectivityManager, {
  WatchConnectivityEvents,
} from '../../modules/applewatch/WatchConnectivityManager';
import {WorkoutState} from '../../modules/applewatch/workoutState';

const companionApp = 'companionAppLog: ';

export const useAppleWatch = () => {
  const [messageFromWatch, setMessageFromWatch] = useState('');
  const [bpm, setBpm] = useState(0);
  const [kcalBurned, setKcalBurned] = useState(0);
  const [activeKcalBurned, setActiveKcalBurned] = useState(0);
  const [elapsedTimeSeconds, setElapsedTimeSeconds] = useState(0);
  const [workoutState, setWorkoutState] = useState<WorkoutState>(
    WorkoutState.NOT_STARTED,
  );

  useEffect(() => {
    const notificationMessageChangedListener =
      WatchConnectivityEvents.addListener(
        'onNotificationMessageChanged',
        message => {
          console.log(
            `${companionApp} Notification Message Changed: ${message?.text}`,
          );
          setMessageFromWatch(message?.text);
        },
      );

    const bpmReceivedListener = WatchConnectivityEvents.addListener(
      'bpm',
      newBpm => {
        console.log(`${companionApp} BPM: ${newBpm}`);
        setBpm(newBpm);
      },
    );

    const kcalBurnedReceivedListener = WatchConnectivityEvents.addListener(
      'kcal',
      newKcal => {
        console.log(`${companionApp}Kcal: ${JSON.stringify(newKcal)}`);
        setKcalBurned(newKcal?.kcal);
        setActiveKcalBurned(newKcal?.activeKcal);
      },
    );

    const elapsedTimeSecondsListener = WatchConnectivityEvents.addListener(
      'elapsedTime',
      newElapsedTime => {
        console.log(`${companionApp} elapsedTime: ${newElapsedTime}`);
        setElapsedTimeSeconds(newElapsedTime);
      },
    );

    const onWorkoutStateChangedListener = WatchConnectivityEvents.addListener(
      'workoutState',
      newState => {
        console.log(`${companionApp} workoutState: ${newState}`);
        setWorkoutState(newState);
      },
    );

    return () => {
      notificationMessageChangedListener.remove();
      bpmReceivedListener.remove();
      kcalBurnedReceivedListener.remove();
      elapsedTimeSecondsListener.remove();
      onWorkoutStateChangedListener.remove();
    };
  }, []);

  const sendMessageToWatch = (message: string) => {
    WatchConnectivityManager.sendMessage(message);
  };

  const changeWorkoutState = (newState: WorkoutState) => {
    WatchConnectivityManager.updateWorkoutState(newState);
  };

  return {
    sendMessageToWatch,
    changeWorkoutState,
    watchMessage: messageFromWatch,
    bpm,
    activeKcalBurned,
    kcalBurned,
    elapsedTimeSeconds,
    workoutState,
  };
};
