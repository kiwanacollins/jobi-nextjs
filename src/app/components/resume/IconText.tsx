import { View, Styles, StyleSheet } from '@react-pdf/renderer';
import { Icon, IconName } from './Icon';

export interface IconTextProps {
  style?: Styles;
  iconName: IconName;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 8,
    marginLeft: 4
  }
});

export function IconText({ style, iconName }: IconTextProps) {
  return (
    <View style={[styles.container, style!]}>
      <Icon size={10} name={iconName} />
    </View>
  );
}
