import { createSlice } from "@reduxjs/toolkit";

const ugvCoordinatesSlice = createSlice({
  name: "ugvCoordinates",
  initialState: {
    
    cityCoordinates: { latitude:70.787345, longitude:126.187801},
  },
  reducers: {
    
    setCityCoordinates: (state, action) => {
      console.log(action);
      if (action.payload && action.payload.latitude !== undefined && action.payload.longitude !== undefined) {
        state.cityCoordinates = action.payload;
      } else {
        console.error("Invalid payload for setCityCoordinates:", action.payload);
      }
    },
  },
});

export const {  setCityCoordinates } = ugvCoordinatesSlice.actions;
export const selectCityCoordinates = (state) => state.ugvCoordinates.cityCoordinates;

export default ugvCoordinatesSlice.reducer; 