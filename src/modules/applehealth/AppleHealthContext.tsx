import React, {
  useState,
  useCallback,
  createContext,
  ReactNode,
  useEffect,
} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthInputOptions,
} from 'react-native-health';

interface AppleHealthContextProps {
  initialized: boolean;
  errorInitializing: string | undefined;
  authStatus: any | undefined;
  heartRateSamples: number[];
  exerciseTimeSeconds: number;
  activeEnergyBurnedKcals: number;
  basalEnergyBurnedKcals: number;
  initHealthKit: (startDate?: Date, endDate?: Date) => void;
}

const defaultState: AppleHealthContextProps = {
  initialized: false,
  errorInitializing: undefined,
  authStatus: undefined,
  heartRateSamples: [],
  exerciseTimeSeconds: 0,
  activeEnergyBurnedKcals: 0,
  basalEnergyBurnedKcals: 0,
  initHealthKit: _ => {},
};

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
      AppleHealthKit.Constants.Permissions.AppleExerciseTime,
    ],
    write: [], // no need of write permissions for now
  },
} as HealthKitPermissions;

type Props = {
  children: ReactNode;
};

export const AppleHealthContext =
  createContext<AppleHealthContextProps>(defaultState);

export const AppleHealthProvider: React.FC<Props> = ({children}) => {
  const [state, setState] = useState<AppleHealthContextProps>(defaultState);

  const getAppleHealthKitAuthStatus = useCallback(() => {
    AppleHealthKit.getAuthStatus(permissions, (err, result) => {
      if (err) {
        console.error(err);
      }
      setState(prevState => ({...prevState, authStatus: result}));
    });
  }, []);

  const getAppleHeartRateSamples = useCallback(
    (options: HealthInputOptions) => {
      AppleHealthKit.getHeartRateSamples(
        options,
        (callbackError: string, results: HealthValue[]) => {
          console.log(
            `getHeartRateSamples=> error: ${callbackError} results: ${JSON.stringify(
              results,
            )}`,
          );
        },
      );
    },
    [],
  );

  const getAppleExerciseTime = useCallback((options: HealthInputOptions) => {
    AppleHealthKit.getAppleExerciseTime(
      options,
      (callbackError: string, results: HealthValue[]) => {
        console.log(
          `getAppleExerciseTime=> callbackError: ${callbackError} results: ${JSON.stringify(
            results,
          )}`,
        );

        const exerciseTimeSeconds = results.reduce(
          (acc, currentObject) => acc + currentObject.value,
          0,
        );
        setState(prevState => ({...prevState, exerciseTimeSeconds}));
      },
    );
  }, []);

  const getAppleActiveEnergyBurned = useCallback(
    (options: HealthInputOptions) => {
      AppleHealthKit.getActiveEnergyBurned(
        options,
        (callbackError: string, results: HealthValue[]) => {
          /* Samples are now collected from HealthKit */
          console.log(
            `getActiveEnergyBurned=> callbackError: ${callbackError} results: ${JSON.stringify(
              results,
            )}`,
          );

          const activeEnergyBurnedKcals = results.reduce(
            (acc, currentObject) => acc + currentObject.value,
            0,
          );
          setState(prevState => ({...prevState, activeEnergyBurnedKcals}));
        },
      );
    },
    [],
  );

  const getAppleBasalEnergyBurned = useCallback(
    (options: HealthInputOptions) => {
      AppleHealthKit.getBasalEnergyBurned(
        options,
        (callbackError: string, results: HealthValue[]) => {
          /* Samples are now collected from HealthKit */
          console.log(
            `callbackError: ${callbackError} results: ${JSON.stringify(
              results,
            )}`,
          );

          const basalEnergyBurnedKcals = results.reduce(
            (acc, currentObject) => acc + currentObject.value,
            0,
          );
          setState(prevState => ({...prevState, basalEnergyBurnedKcals}));
        },
      );
    },
    [],
  );

  const initHealthKit = useCallback(
    (startDate?: Date, endDate?: Date) => {
      const options = {
        startDate: startDate?.toISOString() || new Date().toISOString(),
        endDate: endDate?.toISOString() || new Date().toISOString(),
        ascending: true, // optional
        includeManuallyAdded: true, // optional
      };

      console.log('initHealthKit called 1');

      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        /* Called after we receive a response from the system */

        console.log('initHealthKit called');
        if (error) {
          console.warn('[ERROR] Cannot grant permissions!');
          setState(prevState => ({
            ...prevState,
            errorInitializing: error,
            initialized: false,
          }));
          return;
        }

        console.log('Can now read or write Apple Health data!');

        setState(prevState => ({
          ...prevState,
          errorInitializing: undefined,
          initialized: true,
        }));

        getAppleHealthKitAuthStatus();
        getAppleActiveEnergyBurned(options);
        getAppleBasalEnergyBurned(options);
        getAppleExerciseTime(options);
        getAppleHeartRateSamples(options);
      });
    },
    [
      getAppleActiveEnergyBurned,
      getAppleBasalEnergyBurned,
      getAppleExerciseTime,
      getAppleHealthKitAuthStatus,
      getAppleHeartRateSamples,
    ],
  );

  useEffect(() => {
    const listener = new NativeEventEmitter(
      NativeModules.AppleHealthKit,
    ).addListener('healthKit:HeartRate:new', async event => {
      console.log('--> observer triggered:', JSON.stringify(event));
    });

    return () => {
      listener?.remove();
    };
  }, []);

  return (
    <AppleHealthContext.Provider value={{...state, initHealthKit}}>
      {children}
    </AppleHealthContext.Provider>
  );
};
