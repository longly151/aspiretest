import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistConfig, persistReducer } from 'redux-persist';
import DeviceInfo from 'react-native-device-info';

const NAME = 'account';
const INITIAL_STATE: Partial<{ accountInfo: Account.AccountInfo; debitCard: Account.Card }> = {
  accountInfo: undefined,
  debitCard: undefined,
};

const slice = createSlice({
  name: NAME,
  initialState: INITIAL_STATE,
  reducers: {
    setAccountInfo: (state, action: PayloadAction<{ data: Account.AccountInfo }>) => {
      state.accountInfo = action.payload.data;
    },
    setDebitCard: (state, action: PayloadAction<{ data: Account.Card }>) => {
      state.debitCard = action.payload.data;
    },
  },
});

const accountPersistConfig: PersistConfig<typeof INITIAL_STATE> = {
  key: NAME,
  storage: AsyncStorage,
  keyPrefix: `${DeviceInfo.getBundleId()}.`,
};

const account = persistReducer(accountPersistConfig, slice.reducer);

export const { setAccountInfo, setDebitCard } = slice.actions;

export default account;
