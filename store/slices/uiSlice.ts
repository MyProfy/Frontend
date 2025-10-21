// Проверьте ваш uiSlice.ts - он должен выглядеть примерно так:

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  modal: {
    isOpen: boolean;
    currentStep: number;
  };
}

const initialState: UIState = {
  modal: {
    isOpen: false,
    currentStep: 1, // Начальный шаг - вход
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state) => {
      state.modal.isOpen = true;
      console.log('🚪 UI: openModal');
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      console.log('🚪 UI: closeModal');
    },
    setModalStep: (state, action: PayloadAction<number>) => {
      state.modal.currentStep = action.payload;
      console.log('➡️ UI: setModalStep to', action.payload);
    },
    resetModal: (state) => {
      state.modal.currentStep = 1;
      state.modal.isOpen = false;
      console.log('🔄 UI: resetModal');
    },
  },
});

export const {
  openModal,
  closeModal,
  setModalStep,
  resetModal,
} = uiSlice.actions;

export default uiSlice.reducer;