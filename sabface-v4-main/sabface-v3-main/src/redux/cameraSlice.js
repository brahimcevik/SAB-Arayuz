import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCamera: 'front',  // Varsayılan olarak ön kamera aktif
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setActiveCamera: (state, action) => {
      state.activeCamera = action.payload;  // Aktif kamerayı güncelle
    },
  },
});

// Action'ları dışa aktarıyoruz
export const { setActiveCamera } = cameraSlice.actions;

// Selector'ı dışa aktarıyoruz
export const selectActiveCamera = (state) => state.camera.activeCamera;

// Reducer'ı dışa aktarıyoruz
export default cameraSlice.reducer;
