import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import withTailwind from '@components/hoc/withTailwind';
import View from '../View/View';
import Color from 'color';
import { useTheme } from '@react-navigation/native';
import { omit, pick } from 'lodash';

const Component: any = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

export interface TouchableProps extends TouchableNativeFeedbackProps, TouchableOpacityProps {
  className?: string;
}

export const containerStyleKeys: any = {
  android: [
    'flex',
    'alignSelf',
    'margin',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'marginVertical',
    'marginHorizontal',
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderWidth',
    'borderTopWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderColor',
    'borderTopColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'backgroundColor',
    'elevation',
    'position',
  ],
  ios: [
    'flex',
    'flexGrow',
    'flexShrink',
    'alignSelf',
    'margin',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'marginVertical',
    'marginHorizontal',
    'elevation',
    'position',
  ],
};

const isWhite = (color?: string) =>
  ['white', '#fff', '#ffffff', '#FFF', '#FFFFFF', '', 'transparent'].includes(color || '');

const Touchable: React.FC<TouchableProps> = React.forwardRef((props, ref: any) => {
  const { style: styleProp, ...otherProps } = props;
  const theme = useTheme();

  const style: StyleProp<ViewStyle> = StyleSheet.flatten(styleProp);

  const otherStyle: StyleProp<ViewStyle> = omit(style, containerStyleKeys[Platform.OS]);

  const borderWidth =
    style?.borderWidth ||
    style?.borderLeftWidth ||
    style?.borderRightWidth ||
    style?.borderTopWidth ||
    style?.borderBottomWidth;

  const containerStyle: StyleProp<ViewStyle> = {
    ...pick(style, containerStyleKeys[Platform.OS]),
    justifyContent: 'center',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    width:
      typeof otherStyle.width === 'number' && borderWidth
        ? otherStyle.width + borderWidth
        : otherStyle.width,
    height:
      typeof otherStyle.height === 'number' && borderWidth
        ? otherStyle.height + borderWidth
        : otherStyle.height,
  };

  const background =
    Platform.OS === 'android' && Platform.Version >= 21
      ? TouchableNativeFeedback.Ripple(
          Color(
            containerStyle?.backgroundColor && !isWhite(containerStyle?.backgroundColor as string)
              ? containerStyle?.backgroundColor
              : theme.colors.grey3,
          )
            .lighten(
              containerStyle?.backgroundColor && !isWhite(containerStyle?.backgroundColor as string)
                ? 2
                : 0,
            )
            .alpha(0.4)
            .rgb()
            .string(),
          false,
        )
      : undefined;

  return (
    <View testID="ContainerView" style={containerStyle}>
      <Component
        testID="Touchable"
        ref={ref}
        {...otherProps}
        background={background}
        style={{ flexGrow: otherStyle.flexGrow }}
      >
        <View testID="TouchableView" style={otherStyle}>
          {props.children}
        </View>
      </Component>
    </View>
  );
});

export interface TouchableType
  extends Omit<
      TouchableNativeFeedback,
      | 'UNSAFE_componentWillReceiveProps'
      | 'UNSAFE_componentWillUpdate'
      | 'componentDidUpdate'
      | 'componentWillReceiveProps'
      | 'componentWillUpdate'
      | 'getSnapshotBeforeUpdate'
      | 'props'
      | 'refs'
      | 'setState'
      | 'shouldComponentUpdate'
    >,
    TouchableOpacity {}

export default withTailwind(Touchable) as React.FC<
  TouchableProps & { ref?: React.LegacyRef<TouchableNativeFeedback | TouchableOpacity> }
>;
