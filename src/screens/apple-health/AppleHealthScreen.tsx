import React, {useEffect} from 'react';
import {useAppleHealth} from '../../hooks/applehealth/useAppleHealth';
import Styled from './AppleHealthScreen.styled';
import {Button} from 'react-native';
import {useAppleWatch} from '../../hooks/applewatch/useAppleWatch';

const AppleHealthScreen = () => {
  const {
    initHealthKit,
    initialized,
    errorInitializing,
    basalEnergyBurnedKcals,
    activeEnergyBurnedKcals,
    exerciseTimeMinutes,
  } = useAppleHealth();

  const {sendMessageToWatch, watchMessage} = useAppleWatch();

  useEffect(() => {
    initHealthKit(new Date(2023, 12, 28), new Date(2024, 1, 29));
  }, [initHealthKit]);

  const onPress = () => {
    sendMessageToWatch('message sent from iPhone');
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

        <Styled.Title>Watch Message</Styled.Title>
        <Styled.Description>{watchMessage}</Styled.Description>

        <Styled.Button onPress={onPress}>
          Click to send a message to apple watch!
        </Styled.Button>
      </Styled.Container>
    </Styled.Body>
  );
};

export default AppleHealthScreen;
