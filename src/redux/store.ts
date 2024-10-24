import paymentsSlice from '@/redux/features/UPI/paymentsSlices';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['payments'],
};

const rootReducer = combineReducers({
  payments: paymentsSlice.reducer,
});

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
});

export default store;

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
