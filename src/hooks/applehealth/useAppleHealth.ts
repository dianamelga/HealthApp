import {useContext} from 'react';
import {AppleHealthContext} from '../../modules/applehealth/AppleHealthContext';

export const useAppleHealth = () => {
  const {
    initHealthKit,
    initialized,
    errorInitializing,
    authStatus,
    heartRateSamples,
    exerciseTimeSeconds,
    activeEnergyBurnedKcals,
    basalEnergyBurnedKcals,
  } = useContext(AppleHealthContext);

  return {
    initHealthKit,
    initialized,
    errorInitializing,
    authStatus,
    heartRateSamples,
    exerciseTimeSeconds,
    exerciseTimeMinutes: Math.floor(exerciseTimeSeconds),
    activeEnergyBurnedKcals,
    basalEnergyBurnedKcals,
  };
};
