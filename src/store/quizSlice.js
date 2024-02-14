import { createSlice } from "@reduxjs/toolkit";

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    passingRate: null,
    numQuestions: null,
    quizTypes: null
  },
  reducers: {
    setQuizSettings: (state, action) => {
      state.passingRate = action.payload.passingRate;
      state.numQuestions = action.payload.numQuestions;
      state.quizTypes = action.payload.quizTypes;
    },
  },
});
  
export const { setQuizSettings } = quizSlice.actions;
export default quizSlice.reducer;