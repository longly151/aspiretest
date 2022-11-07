import React, { useEffect, useState } from 'react';
import { ErrorText, Icon, Image, Loading, Text, TouchableOpacity, View } from '@components';
import { useRequest } from '@components/hooks';
import { useTranslation } from 'react-i18next';
import AppView from '@utils/AppView';
import { useTheme } from '@react-navigation/native';
import { useAppSelector } from '@utils/Redux';
import { setDebitCard } from '@store/account';

interface Props {
  refreshing: boolean;
  onRefresh: (newValue?: boolean) => void;
}

const Card: React.FC<Props> = props => {
  const { refreshing, onRefresh } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  const [isShowCardNumber, setIsShowCardNumber] = useState(false);

  const data = useAppSelector(state => state.account.debitCard);
  const { fetch, loading, error } = useRequest('/debit-card/', {
    redux: {
      data,
      setData: setDebitCard,
    },
  });

  useEffect(() => {
    if (refreshing && !loading) {
      fetch();
      onRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, refreshing]);

  const renderFetchedContent = () => {
    if (loading) {
      return (
        <View className="items-center justify-center w-full h-full">
          <Loading color="white" size="large" />
        </View>
      );
    }
    if (error) {
      return (
        <View className="items-center justify-center w-full h-full">
          <ErrorText error={error} />
        </View>
      );
    }
    if (data) {
      const cardNumberContent = [
        data.cardNumber.substring(0, 4),
        data.cardNumber.substring(4, 8),
        data.cardNumber.substring(8, 12),
        data.cardNumber.substring(12, 16),
      ];

      return (
        <View className="flex-row h-full w-full">
          <View className="absolute right-0 top-0">
            <Image
              source={{ uri: data.logoImageUrl }}
              width={74}
              height={21}
              resizeMode="contain"
              disablePlaceholder
            />
          </View>
          <View className="mt-[45px] mb-6">
            <Text className="mb-6 text-[22px] font-bold text-white">{data.name}</Text>
            <View className="flex-row -ml-3 -mr-3 flex-wrap items-center">
              {cardNumberContent.map((e, i) => (
                <Text key={i.toString()} className="text-white font-semibold mx-3 items-center">
                  {!isShowCardNumber && i !== cardNumberContent.length - 1
                    ? e.replace(/\d/g, '●')
                    : e}
                </Text>
              ))}
            </View>
            <View className="flex-row mt-[15px]">
              <Text className="text-white text-[13px] font-semibold">{`${t('debitCard.thru')}: ${
                data.validThru
              }`}</Text>
              <Text className="text-white text-[13px] font-semibold ml-8">{`${t(
                'debitCard.cvv',
              )}: `}</Text>
              <Text
                className="text-white font-semibold"
                style={{
                  fontSize: isShowCardNumber ? 13 : 20,
                  lineHeight: isShowCardNumber ? undefined : 25,
                }}
              >{`${isShowCardNumber ? data.cvv : data.cvv.replace(/\d/g, '*')}`}</Text>
            </View>
          </View>
          <View className="absolute right-0 bottom-0">
            <Icon type="svg" name="visaLogo" color="white" />
          </View>
        </View>
      );
    }
  };

  const toggleShowCard = () => setIsShowCardNumber(previousState => !previousState);

  return (
    <View>
      <TouchableOpacity
        className="px-4 mx pt-2 pb-5 -mb-3 rounded-tl-md rounded-tr-md bg-white self-end flex-row items-center"
        activeOpacity={1}
        onPress={toggleShowCard}
      >
        <Icon type="svg" name={isShowCardNumber ? 'eyeOff' : 'eye'} color={theme.colors.primary} />
        <Text className="text-sm ml-1.5 font-semibold" color={theme.colors.primary}>
          {isShowCardNumber ? t('debitCard.hideCardNumber') : t('debitCard.showCardNumber')}
        </Text>
      </TouchableOpacity>
      <View
        className="h-[220px] p-6 mx rounded-xl"
        style={{
          backgroundColor: data?.backgroundColor || theme.colors.primary,
          ...AppView.shadow(4),
          marginBottom: 24,
        }}
      >
        <View>{renderFetchedContent()}</View>
      </View>
    </View>
  );
};

export default Card;
