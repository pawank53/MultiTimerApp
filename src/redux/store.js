// store.js
import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogBox} from 'react-native';
LogBox.ignoreAllLogs();


// Configuration for persisting the store in AsyncStorage
const persistConfig = {
    key: 'root', // The key for the persisted data
    storage: AsyncStorage // Specifying AsyncStorage as the storage mechanism
};
// 🔹 Wrapping the reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, timerReducer);

const store = configureStore({
    reducer: {
        timer: persistedReducer, 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disabling serialization check for Redux Persist
        }),
});

export const persistor = persistStore(store);
export default store;