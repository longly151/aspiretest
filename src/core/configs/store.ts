import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storeItems from '@store';
import RNAsyncStorageFlipper from 'rn-async-storage-flipper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function handleMiddleware(getDefaultMiddleware: any) {
  const middlewares = getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  });

  // @ts-ignore
  if (__DEV__ && !process.env.JEST_WORKER_ID) {
    const reduxDebugger = require('redux-flipper').default;
    const asyncStorageDebugger = () => () => (next: any) => (action: any) => {
      RNAsyncStorageFlipper(AsyncStorage as any);
      return next(action);
    };
    middlewares.push(reduxDebugger());
    middlewares.push(asyncStorageDebugger());
  }
  return middlewares;
}

export const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: combineReducers(storeItems),
    middleware: handleMiddleware,
    preloadedState,
    devTools: true,
  });

const store = createStore();

export const persistor = persistStore(store);

export default store;
