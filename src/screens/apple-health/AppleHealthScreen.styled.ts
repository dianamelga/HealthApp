import styled from 'styled-components/native';
import {DefaultTheme, Text, Button} from 'react-native-paper';

const Styled = {
  Body: styled.View`
    background-color: ${DefaultTheme.colors.background};
    justify-content: center;
  `,
  Container: styled.View`
    margin-top: 32px;
    padding-horizontal: 24px;
    border-color: red;
  `,
  Title: styled(Text)`
    color: ${DefaultTheme.colors.primary};
    font-size: 25px;
  `,
  Description: styled(Text)`
    color: ${DefaultTheme.colors.secondary};
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 35px;
  `,
  Button: styled(Button).attrs({})`
    background-color: ${DefaultTheme.colors.tertiaryContainer};
  `,
};

export default Styled;
