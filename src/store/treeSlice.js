import { createSlice } from "@reduxjs/toolkit";

const treeSlice = createSlice({
  name: 'tree',
  initialState: {
    treeID: null,
    treeName: null,
    treeEdition: null,
    treePostType: null,
  },
  reducers: {
    setTreeDetails: (state, action) => {
      state.treeID = action.payload.id
      state.treeName = action.payload.name
      state.treeEdition = action.payload.edition
      state.treePostType = action.payload.postType
    },
  },
});
  
export const { setTreeDetails } = treeSlice.actions;
export default treeSlice.reducer;