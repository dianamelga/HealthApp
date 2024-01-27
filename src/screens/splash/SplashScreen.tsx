import React from 'react';
import Styled from './SplashScreen.styled';

interface Props { }
const SplashScreen: React.FC<Props> = () => {
  return (
    <Styled.Container>
      <Styled.Image source={require('assets/images/splash.png')} />
      <Styled.Title variant="headlineLarge">
        Welcome to your personal health tracker
      </Styled.Title>
    </Styled.Container>
  );
};

export default SplashScreen;
