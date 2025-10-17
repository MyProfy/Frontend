import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  modal: {
    isOpen: boolean
    currentStep: number
  }
}

const initialState: UIState = {
  modal: {
    isOpen: false,
    currentStep: 1,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state) => {
      state.modal.isOpen = true
    },
    closeModal: (state) => {
      state.modal.isOpen = false
      state.modal.currentStep = 1
    },
    setModalStep: (state, action: PayloadAction<number>) => {
      state.modal.currentStep = action.payload
    },
    resetModal: (state) => {
      state.modal.currentStep = 1
    },
  },
})

export const { openModal, closeModal, setModalStep, resetModal } = uiSlice.actions

export default uiSlice.reducer