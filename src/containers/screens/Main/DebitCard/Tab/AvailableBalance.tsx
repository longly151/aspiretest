import React from 'react';
import { ErrorText, Loading, Text, View } from '@components';
import { useTranslation } from 'react-i18next';
import Helper from '@utils/Helper';
import { TError } from '@utils/Api';

interface Props {
  loading: boolean;
  data?: Account.AccountInfo;
  error: TError | null;
}

const AvailableBalance: React.FC<Props> = props => {
  const { t } = useTranslation();
  const { loading, data, error } = props;

  const renderFetchedContent = () => {
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <ErrorText error={error} />;
    }
    return (
      <View className="my-[5px] flex-row items-center">
        <View className="bg-color-primary px-3 py-[3px] rounded-[4px]">
          <Text className="font-bold text-xs text-white">{data?.symbol}</Text>
        </View>
        <Text className="mx-2.5 font-bold text-2xl text-white">
          {Helper.currencyFormat(data?.availableBalance || 0)}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <Text className="text-white my-[5px] font-medium">{t('debitCard.availableBalance')}</Text>
      <View className="self-start">{renderFetchedContent()}</View>
    </View>
  );
};

export default AvailableBalance;
