import {
  StyleProp,
  StyleSheet,
  Switch as RNSwitch,
  SwitchProps as RNSwitchProps,
  ViewStyle,
} from 'react-native';
import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { useTheme } from '@react-navigation/native';
import Loading from '../Loading';
import View from '../View/View';

export interface SwitchProps extends RNSwitchProps {
  loading?: boolean;
  className?: string;
}
const Switch: React.FC<SwitchProps> = React.forwardRef((props, ref: any) => {
  const theme = useTheme();
  const { loading, style: styleProp, ...otherProps } = props;
  const style: StyleProp<ViewStyle> = StyleSheet.flatten(styleProp);

  return (
    <>
      <RNSwitch
        testID="Switch"
        ref={ref}
        trackColor={{
          true: theme.colors.primary,
          false: theme.colors.grey4,
        }}
        ios_backgroundColor={style?.backgroundColor || theme.colors.grey4}
        thumbColor="white"
        {...otherProps}
        style={[style, { opacity: loading ? 0 : 1 }]}
      >
        {props.children}
      </RNSwitch>
      {loading && (
        <View className="absolute self-center justify-center items-center">
          <Loading />
        </View>
      )}
    </>
  );
});

export interface SwitchType extends RNSwitch {}

export default withTailwind(Switch) as React.FC<SwitchProps & { ref?: React.LegacyRef<RNSwitch> }>;
