import styled from 'styled-components/native';
import {DefaultTheme, Text} from 'react-native-paper';

const Styled = {
  Body: styled.View`
    background-color: ${DefaultTheme.colors.background};
    border-width: 1px;
    justify-content: center;
  `,
  Container: styled.View`
    margin-top: 32px;
    padding-horizontal: 24px;
    border-color: red;
    border-width: 1px;
  `,
  Title: styled(Text)`
    color: ${DefaultTheme.colors.primary};
  `,
  Description: styled(Text)`
    color: ${DefaultTheme.colors.secondary};
  `,
};

export default Styled;
