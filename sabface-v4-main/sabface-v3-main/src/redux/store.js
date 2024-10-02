import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import navigationReducer from "./navigationSlice";
import ugvReducer from "./ugvSlice";
import modeReducer from './modeSlice';  // modeSlice'i ekledik

const store = configureStore({
  reducer: {
    auth: authReducer,
    navigation: navigationReducer,
    ugv: ugvReducer,
    mode: modeReducer,  // modeReducer'ı store'a ekledik
  },
});

export default store;
