import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
      currentScreen: "loading",
      loading: false,
      slideIndex: 0,
      isModalOpen: false,
    },
    reducers: {
      setCurrentScreen: (state, action) => {
        state.currentScreen = action.payload;
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      goToPreviousQuestion: (state, action) => {
        state.slideIndex = (state.slideIndex - 1 + action.payload.length) % action.payload.length;
      },
      goToNextQuestion: (state, action) => {
        state.slideIndex = (state.slideIndex + 1) % action.payload.length;
      },
      resetSlideIndex: (state, action) => {
        state.slideIndex = 0
      },
      openModal: (state) => {
        state.isModalOpen = true;
      },
      closeModal: (state) => {
        state.isModalOpen = false;
      },
      sendCloseModalMessage: () => {
        // No need to modify state here, as it's handled in the middleware
      },
    },
  });
  
export const { setLoading, setCurrentScreen, goToPreviousQuestion, goToNextQuestion, resetSlideIndex, openModal, closeModal, sendCloseModalMessage } = uiSlice.actions;
export default uiSlice.reducer;