import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    quizData: null,
    resultsData: null,
    numAnswers: 0,
    percentageCorrect: 0,
    totalEstTime: 0,
  },
  reducers: {
    setQuizData: (state, action) => {
      state.quizData = action.payload;
    },
    setResultsData: (state, action) => {
      state.resultsData = action.payload;
    },
    updateItem: (state, action) => {
      const existingItem = state.resultsData.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          resultsData: state.resultsData.map(item =>
            item.id === action.payload.id ? { ...item, ...action.payload } : item
          ),
        };
      } else {
        return { ...state, resultsData: [...state.resultsData, action.payload] };
      }
    },
    removeItem: (state, action) => {
      let newResultsData = state.resultsData.map((obj) => {
        if (obj.id === action.payload) {
          return {
            ...obj,
            userChoice: null,
          };
        }
        return obj;
      });
      return { ...state, resultsData: newResultsData };
    },
    updateNumAnswers: (state, action) => {
      let updatedNumAnswers = state.resultsData.filter(item => item.userChoice !== null).length
      return { ...state, numAnswers: updatedNumAnswers}
    },
    computeCorrectAnswers: (state, action) => {
      let numCorrectAnswers = 0;
      
      action.payload.forEach(result => {
        if (result.userChoice === result.answer) {
          numCorrectAnswers += 1;
        }
      });

      const percentageCorrect = Math.round((numCorrectAnswers / state.quizData.length) * 100);
      return {
        ...state,
        percentageCorrect: percentageCorrect,
      };
    },
    resetCorrectAnswers: (state, action) => {
      state.percentageCorrect = 0
    },
    setTotalEstTime: (state, action) => {
      state.totalEstTime = action.payload
    }
  },
});
  
export const { setQuizData, setResultsData, updateItem, removeItem, updateNumAnswers, computeCorrectAnswers, resetCorrectAnswers, setTotalEstTime } = dataSlice.actions;
export default dataSlice.reducer;