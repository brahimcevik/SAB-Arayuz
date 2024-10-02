
import { createSlice } from "@reduxjs/toolkit";

const ugvSlice = createSlice({
  name: "ugv",
  initialState: {
    selectedId: null,
    ugvName: "",
  },
  reducers: {
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
    setUgvName: (state, action) => {
      state.ugvName = action.payload;
    },
  },
});

export const { setSelectedId, setUgvName } = ugvSlice.actions;
export const selectSelectedId = (state) => state.ugv.selectedId;
export default ugvSlice.reducer;
