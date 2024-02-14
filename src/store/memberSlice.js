import { createSlice } from "@reduxjs/toolkit";

const memberSlice = createSlice({
  name: 'member',
  initialState: {
    masteredArticlesID: null,
  },
  reducers: {
    setMemberDetails: (state, action) => {
      state.masteredArticlesID = action.payload
    },
  },
});
  
export const { setMemberDetails } = memberSlice.actions;
export default memberSlice.reducer;