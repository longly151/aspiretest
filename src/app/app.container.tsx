import { changeLanguageConfig } from '@store/app';
import AppHelper from '@utils/AppHelper';
import { useAppDispatch, useAppSelector } from '@utils/Redux';
import React, { useLayoutEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './app.navigator';
import { LoadingScreen } from './index';
import { useColorScheme } from 'nativewind';
import Helper from '@utils/Helper';

export default function AppContainer() {
  const [language, colorSchemeState] = useAppSelector(state => [
    state.app.language,
    state.app.colorScheme,
  ]);
  const dispatch = useAppDispatch();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [hasInitialized, setHasInitialized] = useState(false);

  useLayoutEffect(() => {
    const initApp = async () => {
      await changeLanguageConfig(language);

      global.fn = {} as any;
      global.dispatch = dispatch;
      if (colorScheme !== colorSchemeState) {
        toggleColorScheme();
      }
      global.theme = { colorScheme: colorSchemeState, toggleColorScheme };

      await AppHelper.setGlobalDeviceInfo();

      setHasInitialized(true);

      await Helper.sleep(100);
      SplashScreen.hide();
    };
    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return hasInitialized ? <AppNavigator /> : <LoadingScreen />;
}
