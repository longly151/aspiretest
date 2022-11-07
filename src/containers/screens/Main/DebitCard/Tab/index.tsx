import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ErrorText,
  Icon,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  Touchable,
  View,
} from '@components';
import AppView from '@utils/AppView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AvailableBalance from './AvailableBalance';
import Card from './Card';
import IconSource from '@icons';
import { Platform, RefreshControl } from 'react-native';
import Navigation from '@utils/Navigation';
import { useMutation, useRequest } from '@components/hooks';
import { useAppDispatch, useAppSelector } from '@utils/Redux';
import { setAccountInfo } from '@store/account';
import Helper from '@utils/Helper';

interface Props {}

type Option = {
  iconName: keyof typeof IconSource;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  rightElement?: React.ReactNode;
  onPress: () => any;
};

const DebitCardTab: React.FC<Props> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { top: safeAreaTop } = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const data = useAppSelector(state => state.account.accountInfo);
  const { fetch, loading, error } = useRequest<Account.AccountInfo>('/accounts/1', {
    redux: {
      data,
      setData: setAccountInfo,
    },
  });

  const [updateWeeklyLimit, { loading: updateWeeklyLimitLoading, error: updateWeeklyLimitError }] =
    useMutation<Account.AccountInfo, Partial<Account.AccountInfo>>('/accounts/1', 'PUT');

  const toggleWeeklyLimit = async () => {
    const hasWeeklyLimit = !!data?.weeklySpendingLimit;
    if (hasWeeklyLimit) {
      const result = await updateWeeklyLimit({ weeklySpendingLimit: 0 });
      if (result) {
        dispatch(setAccountInfo({ data: result }));
      }
    } else {
      Navigation.navigate('WeeklySpendingLimit');
    }
  };

  const options: Option[] = [
    {
      iconName: 'topUp',
      title: t('debitCard.topUpAccount'),
      description: t('debitCard.topUpAccountDesc'),
      onPress: () => {},
    },
    {
      iconName: 'spendingLimit',
      title: t('debitCard.weeklySpendingLimit'),
      description: data?.weeklySpendingLimit ? (
        <View className="flex-row items-center">
          <View className="bg-color-primary items-center justify-center py-[1px] px-1 rounded-[4px]">
            <Text className="font-bold text-xs text-white">{data?.symbol}</Text>
          </View>
          <Text className="ml-1">{Helper.currencyFormat(data.weeklySpendingLimit)}</Text>
        </View>
      ) : (
        t('debitCard.noWeeklySpendingLimitDesc')
      ),
      onPress: toggleWeeklyLimit,
      rightElement: (
        <Switch
          style={{
            transform: [
              { scaleX: Platform.OS === 'ios' ? 0.75 : 1 },
              { scaleY: Platform.OS === 'ios' ? 0.75 : 1 },
            ],
          }}
          value={!!data?.weeklySpendingLimit}
          disabled={!data}
          loading={updateWeeklyLimitLoading}
          onChange={toggleWeeklyLimit}
        />
      ),
    },
    {
      iconName: 'freezeCard',
      title: t('debitCard.freezeCard'),
      description: t('debitCard.noFreezeCardDesc'),
      onPress: () => {},
      rightElement: (
        <Switch
          style={{
            transform: [
              { scaleX: Platform.OS === 'ios' ? 0.75 : 1 },
              { scaleY: Platform.OS === 'ios' ? 0.75 : 1 },
            ],
          }}
        />
      ),
    },
    {
      iconName: 'newCard',
      title: t('debitCard.newCard'),
      description: t('debitCard.newCardDesc'),
      onPress: () => {},
    },
    {
      iconName: 'deactivatedCard',
      title: t('debitCard.deactivatedCards'),
      description: t('debitCard.noDeactivatedCardsDesc'),
      onPress: () => {},
    },
  ];

  const renderItem = (item: Option, index: number) => (
    <Touchable
      key={index.toString()}
      className="flex-row justify-between py-3 px"
      onPress={item.onPress}
    >
      <View className="flex-row flex-shrink">
        <Icon type="svg" name={item.iconName} size={24} color={theme.colors.primary} />
        <View className="ml-3 mr-1 flex-shrink">
          {typeof item.title === 'string' ? (
            <Text className="font-medium">{item.title}</Text>
          ) : (
            item.title
          )}
          {typeof item.description === 'string' ? (
            <Text className="text-[13px] text-color-subText/40">{item.description}</Text>
          ) : (
            item.description
          )}
        </View>
      </View>
      <View>{item.rightElement}</View>
    </Touchable>
  );

  const onRefresh = (newValue?: boolean) =>
    setRefreshing(typeof newValue !== 'undefined' ? newValue : !refreshing);

  useEffect(() => {
    if (refreshing && !loading) {
      fetch();
      onRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, refreshing]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      <View>
        <View
          className="px absolute w-full"
          style={{
            paddingTop: safeAreaTop,
            height: 0.5 * AppView.screenHeight,
            backgroundColor: theme.colors.darkBlue,
          }}
        >
          <Icon
            type="svg"
            name="logo"
            style={{
              position: 'absolute',
              top: safeAreaTop + 19,
              right: AppView.bodyPaddingHorizontal,
            }}
            color={theme.colors.primary}
            width={25}
            height={25}
          />
          <Text className="my-8 text-white font-bold text-2xl">{t('debitCard.debitCard')}</Text>
          <AvailableBalance loading={loading} data={data} error={error} />
        </View>
        <SafeAreaView edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
              />
            }
          >
            <View
              style={{
                backgroundColor: theme.colors.white,
                marginTop: 264,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
            >
              <View className="-mt-24 -mb-3">
                <Card refreshing={refreshing} onRefresh={onRefresh} />
              </View>
              <ErrorText error={updateWeeklyLimitError} />
              <View className="mb-6">{options.map(renderItem)}</View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default DebitCardTab;
