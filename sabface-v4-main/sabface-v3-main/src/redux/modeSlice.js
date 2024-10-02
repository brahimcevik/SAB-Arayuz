import { createSlice } from '@reduxjs/toolkit';

const modeSlice = createSlice({
  name: 'mode',
  initialState: {
    modes: {} // Her robotun manuel/otomatik mod durumu burada saklanacak
  },
  reducers: {
    modeClick: (state, action) => {
      const { robotId } = action.payload;
      // Eğer robotun modu yoksa varsayılan olarak false (otomatik) yaparız
      if (!state.modes[robotId]) {
        state.modes[robotId] = false;
      }
      // Robotun modunu manuel/otomatik arasında değiştiririz
      state.modes[robotId] = !state.modes[robotId];
    },
  },
});

export const { modeClick } = modeSlice.actions;

// Seçili robotun manuel/otomatik mod durumunu döner
export const selectisManuel = (state, robotId) => state.mode.modes[robotId] || false;

export default modeSlice.reducer;
