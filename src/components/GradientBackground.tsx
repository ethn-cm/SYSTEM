import type { ReactNode } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

export default function GradientBackground({ children }: Props) {
  return (
    <ImageBackground
      source={require('../../assets/images/gradient.jpeg')}
      style={styles.bg}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});
