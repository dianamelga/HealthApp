import {useContext} from 'react';
import {WorkoutManagerContext} from '../../modules/workout-manager/WorkoutManagerContext';
import {WorkoutState} from '../../modules/applewatch/workoutState';

export const useWorkoutManager = () => {
  const {workoutState, workoutStats, changeWorkoutStateAppleWatch} = useContext(
    WorkoutManagerContext,
  );

  const startWorkout = () => {
    changeWorkoutStateAppleWatch(WorkoutState.IN_PROGRESS);
  };

  const endWorkout = () => {
    changeWorkoutStateAppleWatch(WorkoutState.COMPLETED);
  };

  const pauseWorkout = () => {
    changeWorkoutStateAppleWatch(WorkoutState.PAUSED);
  };

  const resumeWorkout = () => {
    changeWorkoutStateAppleWatch(WorkoutState.IN_PROGRESS);
  };

  return {
    workoutState,
    workoutStats,
    startWorkout,
    endWorkout,
    pauseWorkout,
    resumeWorkout,
  };
};
