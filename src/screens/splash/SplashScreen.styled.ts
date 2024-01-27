import {DefaultTheme, Text} from 'react-native-paper';
import {View, Image} from 'react-native';
import styled from 'styled-components/native';

const Styled = {
  Container: styled(View)`
    background: ${DefaultTheme.colors.background};
    padding: 20px;
    justify-content: center;
    flex: 1;
  `,
  Title: styled(Text)`
    color: ${DefaultTheme.colors.primary};
  `,
  Image: styled(Image)``,
};

export default Styled;
