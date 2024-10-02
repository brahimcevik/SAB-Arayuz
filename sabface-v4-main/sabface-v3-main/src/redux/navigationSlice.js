// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    isVehicleClicked: false,
  },
  reducers: {
    vehicleCardClick: (state) => {
      state.isVehicleClicked = !state.isVehicleClicked;
    },
  },
});

export const { vehicleCardClick } = navigationSlice.actions;
export const selectIsVehicleClicked = (state) => state.navigation.isVehicleClicked;
export default navigationSlice.reducer;
