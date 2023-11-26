import React, {useEffect} from 'react';
import {useAppleHealth} from '../hooks/applehealth/useAppleHealth';
import Styled from './AppleHealthScreen.styled';

const AppleHealthScreen = () => {
  const {
    initHealthKit,
    initialized,
    errorInitializing,
    basalEnergyBurnedKcals,
    activeEnergyBurnedKcals,
    exerciseTimeMinutes,
  } = useAppleHealth();

  useEffect(() => {
    initHealthKit(new Date(2023, 10, 21), new Date(2023, 10, 22));
  }, [initHealthKit]);

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
        <Styled.Title>Exercise time in seconds</Styled.Title>
        <Styled.Description>{exerciseTimeMinutes}</Styled.Description>
        <Styled.Title>Basal Energy Burned Kcal</Styled.Title>
        <Styled.Description>
          {Math.floor(basalEnergyBurnedKcals)}
        </Styled.Description>
        <Styled.Title>Active Energy Burned Kcal</Styled.Title>
        <Styled.Description>
          {Math.floor(activeEnergyBurnedKcals)}
        </Styled.Description>
      </Styled.Container>
    </Styled.Body>
  );
};

export default AppleHealthScreen;
