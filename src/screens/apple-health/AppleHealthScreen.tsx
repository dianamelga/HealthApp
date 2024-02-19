import React, {useEffect} from 'react';
import {useAppleHealth} from '../../hooks/applehealth/useAppleHealth';
import Styled from './AppleHealthScreen.styled';
import {useWorkoutManager} from '../../hooks';
import {WorkoutState} from '../../modules/applewatch/workoutState';

const AppleHealthScreen = () => {
  const {
    initHealthKit,
    initialized,
    errorInitializing,
    basalEnergyBurnedKcals,
    activeEnergyBurnedKcals,
    exerciseTimeMinutes,
  } = useAppleHealth();

  const {
    startWorkout,
    endWorkout,
    pauseWorkout,
    resumeWorkout,
    workoutState,
    workoutStats,
  } = useWorkoutManager();

  useEffect(() => {
    initHealthKit(new Date(2024, 2, 10), new Date(2024, 2, 11));
  }, [initHealthKit]);

  const onStart = () => {
    startWorkout();
  };

  const onTogglePause = () => {
    if (workoutState === WorkoutState.PAUSED) {
      resumeWorkout();
    } else {
      pauseWorkout();
    }
  };
  const onEnd = () => {
    endWorkout();
  };

  return (
    <Styled.Body>
      <Styled.Container>
        <Styled.Title>React Native Health Example</Styled.Title>
        <Styled.Title>Initialized</Styled.Title>
        <Styled.Description>{initialized}</Styled.Description>
        {errorInitializing && (
          <>
            <Styled.Title>Error Initializing</Styled.Title>
            <Styled.Description>{errorInitializing}</Styled.Description>
          </>
        )}
        {/* <Styled.Title>Exercise time in seconds</Styled.Title>
        <Styled.Description>{exerciseTimeMinutes}</Styled.Description>
        <Styled.Title>Basal Energy Burned Kcal</Styled.Title>
        <Styled.Description>
          {Math.floor(basalEnergyBurnedKcals)}
        </Styled.Description>
        <Styled.Title>Active Energy Burned Kcal</Styled.Title>
        <Styled.Description>
          {Math.floor(activeEnergyBurnedKcals)}
        </Styled.Description> */}

        <Styled.Title>Workout State</Styled.Title>
        <Styled.Description>{workoutState}</Styled.Description>
        <Styled.Title>Workout Stats</Styled.Title>
        <Styled.Description>{JSON.stringify(workoutStats)}</Styled.Description>

        <Styled.Button onPress={onStart}>Start Workout</Styled.Button>
        <Styled.Button onPress={onTogglePause}>
          Pause/Resume Workout
        </Styled.Button>
        <Styled.Button onPress={onEnd}>End Workout</Styled.Button>
      </Styled.Container>
    </Styled.Body>
  );
};

export default AppleHealthScreen;
