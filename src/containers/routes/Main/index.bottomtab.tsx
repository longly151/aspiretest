import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppView from '@utils/AppView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useIsFocused, useTheme } from '@react-navigation/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { Platform } from 'react-native';
import BottomTabScreens from '@screens/Main';
import { Icon } from '@components';
import IconSource from '@icons';

const BottomTabs = createBottomTabNavigator();

export default function MainBottomTab() {
  const insets = useSafeAreaInsets();
  /* istanbul ignore else */
  if (!insets.bottom) {
    insets.bottom = 5;
  }
  const { t } = useTranslation();

  const theme = useTheme();

  const isFocused = useIsFocused();

  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  useEffect(() => {
    /* istanbul ignore else */
    if (global.fn) {
      global.fn.setIsTabBarHidden = (isHidden: boolean) => {
        /* istanbul ignore else */
        if (isTabBarHidden !== isHidden) {
          setIsTabBarHidden(isHidden);
        }
      };
    }
  }, [isTabBarHidden, setIsTabBarHidden]);

  useEffect(() => {
    /* istanbul ignore else */
    if (Platform.OS === 'android') {
      if (isFocused) {
        changeNavigationBarColor(theme.colors.card, !theme.dark, false);
      } else {
        changeNavigationBarColor(theme.colors.background, !theme.dark, false);
      }
    }
  }, [isFocused, theme]);

  /**
   * Handle Screen Metrics & SafeAreaInsets
   */

  const renderTab = (param: {
    name: string;
    title: string;
    component: React.FC;
    svgIconName: keyof typeof IconSource;
  }) => (
    <BottomTabs.Screen
      name={param.name}
      component={param.component}
      options={{
        title: param.title,
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Icon type="svg" name={param.svgIconName} color={color} width={24} height={24} />
        ),
      }}
    />
  );

  return (
    <BottomTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.grey5,
        tabBarStyle: {
          display: isTabBarHidden ? 'none' : 'flex',
          backgroundColor: 'white',
          ...AppView.shadow(),
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: AppView.fontFamily,
        },
        ...AppView.getHeaderStyle(theme),
      }}
      initialRouteName="DebitCardTab"
    >
      {renderTab({
        name: 'HomeTab',
        title: t('bottomTab.home'),
        component: BottomTabScreens.HomeTab,
        svgIconName: 'logo',
      })}
      {renderTab({
        name: 'DebitCardTab',
        title: t('bottomTab.debitCard'),
        component: BottomTabScreens.DebitCardTab,
        svgIconName: 'card',
      })}
      {renderTab({
        name: 'PaymentsTab',
        title: t('bottomTab.payments'),
        component: BottomTabScreens.PaymentsTab,
        svgIconName: 'payments',
      })}
      {renderTab({
        name: 'CreditTab',
        title: t('bottomTab.credit'),
        component: BottomTabScreens.CreditTab,
        svgIconName: 'credit',
      })}
      {renderTab({
        name: 'ProfileTab',
        title: t('bottomTab.profile'),
        component: BottomTabScreens.ProfileTab,
        svgIconName: 'profile',
      })}
    </BottomTabs.Navigator>
  );
}
