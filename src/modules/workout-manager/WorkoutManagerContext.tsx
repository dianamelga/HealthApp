import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {WorkoutStats} from './workoutStats';
import {WorkoutState} from '../applewatch/workoutState';
import {useAppleWatch} from 'hooks';

type Props = {
  children: ReactNode;
};

export interface WorkoutManagerContextProps {
  workoutState: WorkoutState;
  workoutStats: WorkoutStats;
  changeWorkoutStateAppleWatch: (workoutState: WorkoutState) => void;
}

const defaultState: WorkoutManagerContextProps = {
  workoutState: WorkoutState.NOT_STARTED,
  workoutStats: {
    kcalBurned: 0,
    kcalActiveBurned: 0,
    elapsedTimeSeconds: 0,
    averageBpm: 0,
  },
  changeWorkoutStateAppleWatch: _ => {},
};

export const WorkoutManagerContext =
  createContext<WorkoutManagerContextProps>(defaultState);

export const WorkoutManagerProvider: React.FC<Props> = ({children}) => {
  const [state, setState] = useState<WorkoutManagerContextProps>(defaultState);
  const {
    changeWorkoutState,
    workoutState: appleWatchWoState,
    bpm,
    kcalBurned,
    activeKcalBurned,
    elapsedTimeSeconds,
  } = useAppleWatch();

  const updateStats = useCallback((workoutStats: WorkoutStats) => {
    setState(prevState => ({
      ...prevState,
      workoutStats,
    }));
  }, []);

  const updateWorkoutState = useCallback((workoutState: WorkoutState) => {
    setState(prevState => ({
      ...prevState,
      workoutState,
    }));
  }, []);

  const changeWorkoutStateAppleWatch = useCallback(
    (workoutState: WorkoutState) => {
      changeWorkoutState(workoutState);
    },
    [changeWorkoutState],
  );

  useEffect(() => {
    updateStats({
      averageBpm: bpm,
      kcalBurned,
      kcalActiveBurned: activeKcalBurned,
      elapsedTimeSeconds: 0,
    });
  }, [bpm, kcalBurned, activeKcalBurned, elapsedTimeSeconds, updateStats]);

  useEffect(() => {
    updateWorkoutState(appleWatchWoState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appleWatchWoState]);

  return (
    <WorkoutManagerContext.Provider
      value={{
        ...state,
        changeWorkoutStateAppleWatch,
      }}>
      {children}
    </WorkoutManagerContext.Provider>
  );
};
