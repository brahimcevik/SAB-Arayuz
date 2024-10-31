import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCameras: [],  // Aktif kameraların tutulduğu dizi
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    toggleCamera: (state, action) => {
      const camera = action.payload;
      if (state.activeCameras.includes(camera)) {
        // Kamera zaten aktifse, diziden çıkar
        state.activeCameras = state.activeCameras.filter(item => item !== camera);
      } else {
        // Kamera aktif değilse, dizinin sonuna ekle
        state.activeCameras.push(camera);
      }
    },
    removeCamera: (state, action) => {
      const cameraToRemove = action.payload;
      // Belirtilen kamerayı diziden çıkar
      state.activeCameras = state.activeCameras.filter(camera => camera !== cameraToRemove);
    },
    clearCameras: (state) => {
      state.activeCameras = [];  // Tüm kameraları temizle
    },
  },
});

// Action'ları dışa aktarıyoruz
export const { toggleCamera, removeCamera, clearCameras } = cameraSlice.actions;

// Selector'ı dışa aktarıyoruz
export const selectActiveCameras = (state) => state.camera.activeCameras;

// Reducer'ı dışa aktarıyoruz
export default cameraSlice.reducer;
