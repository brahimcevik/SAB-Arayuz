import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import navigationReducer from './navigationSlice';
import ugvReducer from './ugvSlice';
import modeReducer from './modeSlice';  // modeSlice'i ekledik
import cameraReducer from './cameraSlice';  // cameraSlice'i import ettik
import ugvCoordinatesReducer from './ugvCoordinatesSlice'; // UGV koordinatları slice'ını import edin

const store = configureStore({
  reducer: {
    auth: authReducer,
    navigation: navigationReducer,
    ugv: ugvReducer,
    mode: modeReducer,  // modeReducer'ı store'a ekledik
    camera: cameraReducer,  // cameraReducer'ı burada ekledik
    ugvCoordinates: ugvCoordinatesReducer, // UGV koordinatları slice'ını buraya ekleyin
  },
});

export default store;
