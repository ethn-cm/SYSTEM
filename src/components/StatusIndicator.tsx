import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';
import type { QuestStatus } from '../data/quests';

interface Props {
  status: QuestStatus;
  size?: number;
}

export default function StatusIndicator({ status, size = 6 }: Props) {
  const style = [
    styles.base,
    {
      width: size,
      height: size,
      borderRadius: status === 'failed' ? 0 : size / 2,
      backgroundColor: status === 'active' ? colors.white : colors.grayMid,
      transform: status === 'failed' ? [{ rotate: '45deg' }] : [],
    },
  ];
  return <View style={style} />;
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 0,
  },
});
