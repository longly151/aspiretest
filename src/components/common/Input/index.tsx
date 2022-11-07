import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  ColorValue,
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  TextInputProps as RNTextInputProps,
  TextInputSubmitEditingEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import withTailwind from '@components/hoc/withTailwind';
import Icon, { IconProps } from '../Icon';
import AppView from '@utils/AppView';
import { useTheme } from '@react-navigation/native';
import Text, { TextProps } from '../Text';
import _ from 'lodash';
import {
  Control,
  RegisterOptions,
  useController,
  useForm,
  UseFormSetFocus,
  UseFormTrigger,
} from 'react-hook-form';
import Color from 'color';
import CONSTANT from '@configs/constant';

export interface NextFieldProps {
  name: string;
  trigger: UseFormTrigger<any>;
  setFocus: UseFormSetFocus<any>;
}

export interface ReactHookFormProps {
  name?: string;
  control?: Control<any>;
  nextField?: NextFieldProps;
  rules?: RegisterOptions;
}

export interface AdditionalTextInputProps extends ReactHookFormProps {
  title?: string;
  titleProps?: TextProps;
  errorProps?: TextProps;
  leftIconProps?: IconProps;
  leftIcon?: React.ReactNode;
  rightIconProps?: IconProps;
  rightIcon?: React.ReactNode;
  color?: ColorValue;
  backgroundColor?: ColorValue;
  inactiveBorderColor?: ColorValue;
  outline?: boolean;
  clear?: boolean;
  component?: any;
  modifyText?: (text: string) => string;
}

export interface InputProps extends RNTextInputProps, AdditionalTextInputProps {
  className?: string;
}

const containerStyleKeys = [
  'flex',
  'flexGrow',
  'flexShrink',
  'flexDirection',
  'alignSelf',
  'justifyContent',
  'alignItems',
  'margin',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'marginVertical',
  'marginHorizontal',
  'position',
];

const inputContainerStyleKeys = [
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
];

export const handleInputStyle = (props: any, theme: App.Theme) => {
  const textColor = props.color || theme.colors.text;
  const backgroundColor =
    props.backgroundColor || (props.outline || props.clear ? 'transparent' : theme.colors.grey5);

  const { quickStyles } = AppView.getInputQuickStyle({
    outline: props.outline,
    clear: props.clear,
    textColor,
  });

  const style: TextStyle = StyleSheet.flatten([
    {
      color: textColor,
      paddingVertical: CONSTANT.INPUT.paddingVertical,
      paddingHorizontal: CONSTANT.INPUT.paddingHorizontal,
      fontSize: CONSTANT.INPUT.fontSize,
      fontWeight: CONSTANT.INPUT.fontWeight,
      borderRadius: AppView.roundedBorderRadius,
      backgroundColor,
    } as TextStyle,
    quickStyles,
    props.style,
  ]);

  const containerStyle: ViewStyle = _.pick(style, containerStyleKeys) as any;

  const inputContainerStyle: ViewStyle = {
    ...(_.pick(style, inputContainerStyleKeys) as any),
    flexDirection: 'row',
    alignItems: 'center',
  };

  const otherStyle: TextStyle = {
    ...(_.omit(style as any, [...containerStyleKeys, ...inputContainerStyleKeys]) as any),
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop:
      Platform.OS === 'ios' && props.multiline ? ((style?.paddingVertical || 4) as number) - 4 : 0,
  };

  const titleStyles: TextStyle[] = [
    {
      marginBottom: 4,
      fontSize: 16,
    },
    props.titleProps?.style,
  ];

  const errorStyles: TextStyle[] = [
    {
      marginTop: 4,
      fontSize: 12,
    },
    props.errorProps?.style,
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { color: iconColor, fontSize: iconSize, ...otherTextStyle } = otherStyle as any;

  const iconPaddingHorizontal = otherTextStyle.paddingLeft || otherTextStyle.paddingHorizontal;

  const commonIconStyles: StyleProp<TextStyle> = [
    otherTextStyle,
    {
      borderRadius: AppView.roundedBorderRadius,
      padding: otherTextStyle.padding,
      paddingLeft: undefined,
      paddingRight: undefined,
      paddingTop: undefined,
      paddingBottom: undefined,
      paddingHorizontal: iconPaddingHorizontal,
      paddingVertical: undefined,
      flexGrow: undefined,
      flexShrink: undefined,
    },
    props.iconProps?.style,
  ];

  const leftIconStyles: StyleProp<TextStyle> = [
    ...commonIconStyles,
    {
      color: props.leftIconProps?.color || theme.colors.grey3,
      marginRight: -iconPaddingHorizontal,
    },
  ];

  const rightIconStyles: StyleProp<TextStyle> = [
    ...commonIconStyles,
    {
      color: props.rightIconProps?.color || theme.colors.grey3,
      marginLeft: -iconPaddingHorizontal,
    },
  ];

  const inactiveBorderColor =
    props.inactiveBorderColor ||
    (theme.dark
      ? theme.colors.grey5
      : Color(theme.colors.grey5).darken(0.1).hex() || theme.colors.grey5);

  const activeBorderColor =
    inputContainerStyle.borderColor ||
    inputContainerStyle.borderTopColor ||
    inputContainerStyle.borderBottomColor ||
    inputContainerStyle.borderLeftColor ||
    inputContainerStyle.borderRightColor ||
    theme.colors.primary;

  const placeholderTextColor = props.placeholderTextColor || theme.colors.grey3;

  return {
    containerStyle,
    inputContainerStyle,
    titleStyles,
    errorStyles,
    leftIconStyles,
    rightIconStyles,
    otherStyle,
    inactiveBorderColor,
    activeBorderColor,
    placeholderTextColor,
  };
};

const Input: React.FC<InputProps> = React.forwardRef((props, ref: any) => {
  let inputRef = useRef<RNTextInput>(null);

  const theme = useTheme();
  const {
    title,
    titleProps,
    errorProps,
    leftIconProps,
    leftIcon,
    rightIconProps,
    rightIcon,
    name,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onChangeText: onChangeTextProp,
    onSubmitEditing: onSubmitEditingProp,
    value: valueProp,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    backgroundColor,
    component,
    control,
    nextField,
    rules,
    modifyText,
    ...otherProps
  } = props;

  const handledStyle = useMemo(() => handleInputStyle(props, theme), [props, theme]);
  const { placeholderTextColor, inactiveBorderColor, activeBorderColor } = handledStyle;

  const [borderColor, setBorderColor] = useState(
    !props.autoFocus ? inactiveBorderColor : activeBorderColor,
  );
  useEffect(() => {
    setBorderColor(inactiveBorderColor);
  }, [inactiveBorderColor]);

  const { control: formControl } = useForm({ mode: 'onTouched' });
  const { field, fieldState, formState } = useController({
    control: control || formControl,
    defaultValue: otherProps.defaultValue,
    rules,
    name: name || '',
  });

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      /* istanbul ignore else */
      if (Platform.OS === 'android') {
        global.fn?.setIsTabBarHidden?.(true);
      }
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      /* istanbul ignore else */
      if (Platform.OS === 'android') {
        global.fn?.setIsTabBarHidden?.(false);
      }
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (!fieldState.error) {
      setBorderColor(activeBorderColor);
    }

    /* istanbul ignore else */
    if (Platform.OS === 'android') {
      global.fn?.setIsTabBarHidden?.(true);
    }
    onFocusProp?.(e);
  };

  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (!fieldState.error) {
      setBorderColor(inactiveBorderColor);
    }
    if (name && control) {
      field.onBlur();
    }

    /* istanbul ignore else */
    if (Platform.OS === 'android') {
      global.fn?.setIsTabBarHidden?.(false);
    }
    onBlurProp?.(e);
  };

  const onChangeText = (e: string) => {
    const newText = modifyText ? modifyText(e) : e;

    if (name && control) {
      field.onChange(newText);
    }
    onChangeTextProp?.(newText);
  };

  const onSubmitEditing = async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    /* istanbul ignore else */
    if (!otherProps.multiline) {
      if (name && control && nextField) {
        const isValidated = await nextField?.trigger(name);
        if (isValidated && !formState.touchedFields[nextField.name]) {
          nextField?.setFocus(nextField.name);
        }
      }
    }
    onSubmitEditingProp?.(e);
  };

  useImperativeHandle(ref, () => ({
    ...inputRef.current,
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {
    if (name && control && fieldState.error && borderColor !== theme.colors.error) {
      setBorderColor(theme.colors.error);
    } else if (
      !fieldState.error &&
      // inputRef.current?.isFocused() &&
      borderColor !== activeBorderColor
    ) {
      setBorderColor(activeBorderColor);
    }
  }, [borderColor, control, fieldState.error, name, theme.colors.error, activeBorderColor]);

  const renderErrors = () => {
    if (name && control && fieldState.error) {
      return (
        <Text
          testID="ErrorText"
          color={theme.colors.error}
          {...errorProps}
          style={handledStyle.errorStyles}
        >
          {fieldState.error.message}
        </Text>
      );
    }
    return null;
  };

  const handleRef = (e: any) => {
    field.ref(e);
    inputRef = {
      current: e,
    };
  };

  const InputComponent = component || RNTextInput;

  return (
    <View testID="ContainerView" style={handledStyle.containerStyle}>
      {title ? (
        <Text testID="TitleText" {...titleProps} style={handledStyle.titleStyles}>
          {title}
        </Text>
      ) : null}

      <View
        testID="InputView"
        style={[
          handledStyle.inputContainerStyle,
          {
            borderColor,
            borderTopColor: borderColor,
            borderBottomColor: borderColor,
            borderLeftColor: borderColor,
            borderRightColor: borderColor,
          },
        ]}
      >
        {leftIcon ? (
          leftIcon
        ) : leftIconProps ? (
          <Icon
            testID="LeftIcon"
            color={handledStyle.otherStyle.color}
            size={handledStyle.otherStyle.fontSize}
            {...leftIconProps}
            style={[handledStyle.leftIconStyles, leftIconProps.style]}
          />
        ) : null}
        <InputComponent
          testID="Input"
          ref={handleRef}
          {...otherProps}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          value={valueProp || (name && typeof field.value === 'string' ? field.value : '')}
          style={handledStyle.otherStyle}
          placeholderTextColor={placeholderTextColor}
        >
          {props.children}
        </InputComponent>
        {rightIcon ? (
          rightIcon
        ) : rightIconProps ? (
          <Icon
            testID="RightIcon"
            color={handledStyle.otherStyle.color}
            size={handledStyle.otherStyle.fontSize}
            {...rightIconProps}
            style={[handledStyle.rightIconStyles, rightIconProps.style]}
          />
        ) : null}
      </View>
      {renderErrors()}
    </View>
  );
});

Input.defaultProps = {
  underlineColorAndroid: 'transparent',
};

export interface InputType extends RNTextInput {}

export default withTailwind(Input) as React.FC<InputProps & { ref?: React.LegacyRef<RNTextInput> }>;
