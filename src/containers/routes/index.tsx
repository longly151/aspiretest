import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainBottomTab from '@routes/Main/index.bottomtab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import AppView from '@utils/AppView';
import { useTheme } from '@react-navigation/native';
import SettingsStack from './Main/DebitCard/index.stack';

const Stack = createNativeStackNavigator();

export const SwitchScreens = {
  MainBottomTab,
};

function SwitchStack() {
  return (
    <Stack.Screen name="MainBottomTab" component={MainBottomTab} options={{ headerShown: false }} />
  );
}

export default function MainStack() {
  const theme = useTheme();
  /**
   * Handle Screen Metrics & SafeAreaInsets
   */

  useEffect(() => {
    Dimensions.addEventListener('change', newDimensions =>
      AppView.onDimensionChange(newDimensions),
    );
  });
  const insets = useSafeAreaInsets();
  AppView.initSafeArea(insets);

  return (
    <Stack.Navigator
      screenOptions={{
        ...AppView.getHeaderStyle(theme),
      }}
    >
      {SwitchStack()}
      {SettingsStack()}
    </Stack.Navigator>
  );
}
