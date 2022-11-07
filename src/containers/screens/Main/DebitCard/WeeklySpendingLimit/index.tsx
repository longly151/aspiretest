import React, { useLayoutEffect } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ErrorText,
  Icon,
  Input,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from '@components';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Navigation from '@utils/Navigation';
import { FlatList, Keyboard } from 'react-native';
import Helper from '@utils/Helper';
import AppView from '@utils/AppView';
import Color from 'color';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '@utils/Redux';
import { useMutation } from '@components/hooks';
import { useDispatch } from 'react-redux';
import { setAccountInfo } from '@store/account';

interface Props {}

const WeeklySpendingLimit: React.FC<Props> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const data = useAppSelector(state => state.account.accountInfo);

  const [updateWeeklyLimit, { loading: updateWeeklyLimitLoading, error: updateWeeklyLimitError }] =
    useMutation<Account.AccountInfo, Partial<Account.AccountInfo>>('/accounts/1', 'PUT');

  const { control, handleSubmit, setValue } = useForm({
    mode: 'onTouched',
    defaultValues: {
      weeklySpendingLimit: '',
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => Navigation.goBack()}>
          <Icon
            type="antdesign"
            name="left"
            color="white"
            size={22}
            style={{ padding: 5, marginLeft: -5 }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Icon type="svg" name="logo" color={theme.colors.primary} width={25} height={25} />
      ),
      headerStyle: { backgroundColor: theme.colors.darkBlue },
    } as NativeStackNavigationOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressSuggestedItem = (value: number) => () => {
    setValue('weeklySpendingLimit', Helper.currencyFormat(value), {
      shouldValidate: true,
    });
  };

  const renderSuggestedItem = ({ item, index }: { item: number; index: number }) => (
    <TouchableOpacity
      key={item}
      className="py-3 rounded items-center"
      style={{
        width: (AppView.bodyWidth - 12 * 2) / 3,
        backgroundColor: Color(theme.colors.primary).alpha(0.07).rgb().string(),
        marginLeft: index === 0 ? 0 : 6,
        marginRight:
          data?.suggestedLimitValues && index === data?.suggestedLimitValues?.length - 1 ? 0 : 6,
      }}
      onPress={onPressSuggestedItem(item)}
    >
      <Text className="text-xs font-semibold text-color-primary">{`${
        data?.symbol
      } ${Helper.inputCurrencyFormat(item.toString())}`}</Text>
    </TouchableOpacity>
  );

  const onSubmit = async (value: { weeklySpendingLimit: string }) => {
    const result = await updateWeeklyLimit({
      weeklySpendingLimit: Helper.numberFormat(value.weeklySpendingLimit),
    });
    if (result) {
      dispatch(setAccountInfo({ data: result }));
      Navigation.goBack();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="h-24 bg-color-darkBlue">
          <Text className="mt-2 font-bold text-2xl text-white px">{t('field.spendingLimit')}</Text>
        </View>
      </TouchableWithoutFeedback>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="-mt-4 p rounded-tl-2xl rounded-tr-2xl bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <ErrorText error={updateWeeklyLimitError} />
        <View className="mt-1 flex-row">
          <Icon type="svg" name="limit" />
          <Text className="ml-3 font-medium">{t('weeklyLimit.setLimit')}</Text>
        </View>
        <Input
          name="weeklySpendingLimit"
          clear
          className="mt-2"
          leftIcon={
            <View className="bg-color-primary -mr-2 px-3 py-[3px] rounded-[4px]">
              <Text className="font-bold text-xs text-white">{data?.symbol}</Text>
            </View>
          }
          modifyText={Helper.inputCurrencyFormat}
          inactiveBorderColor={Color(theme.colors.text).alpha(0.12).rgb().string()}
          autoFocus
          keyboardType="decimal-pad"
          control={control}
          rules={{
            required: t('validator.required', { field: t('field.spendingLimit') }),
          }}
        />
        <Text className="text-[13px] text-color-text/60 mt-3">{t('weeklyLimit.setLimitDesc')}</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data?.suggestedLimitValues || []}
          renderItem={renderSuggestedItem}
          style={{ marginTop: 20 }}
          keyboardShouldPersistTaps="handled"
        />
      </ScrollView>
      <View className="bg-white">
        <Button
          title={t('common.save')}
          className="mx-[33px] my-3 rounded-full"
          onPress={handleSubmit(onSubmit)}
          loading={updateWeeklyLimitLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default WeeklySpendingLimit;
