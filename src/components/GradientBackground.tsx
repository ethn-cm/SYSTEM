import type { ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  children: ReactNode;
}

export default function GradientBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/gradient.jpeg')}
        style={styles.image}
        resizeMode="cover"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
