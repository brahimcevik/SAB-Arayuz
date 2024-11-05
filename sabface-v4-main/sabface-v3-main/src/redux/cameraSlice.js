import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCameras: [],
  cameraStatus: {
    front: false,
    left: false,
    right: false,
  },
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    toggleCamera: (state, action) => {
      const camera = action.payload;
      if (state.activeCameras.includes(camera)) {
        state.activeCameras = state.activeCameras.filter(item => item !== camera);
        state.cameraStatus[camera] = false;
      } else {
        state.activeCameras.push(camera);
        state.cameraStatus[camera] = true;
      }
    },
    removeCamera: (state, action) => {
      const cameraToRemove = action.payload;
      state.activeCameras = state.activeCameras.filter(camera => camera !== cameraToRemove);
      state.cameraStatus[cameraToRemove] = false;
    },
    clearCameras: (state) => {
      state.activeCameras = [];
      state.cameraStatus = { front: false, left: false, right: false };
    },
  },
});

export const { toggleCamera, removeCamera, clearCameras } = cameraSlice.actions;
export const selectActiveCameras = (state) => state.camera.activeCameras;
export const selectCameraStatus = (state) => state.camera.cameraStatus;
export default cameraSlice.reducer;
