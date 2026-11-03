import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  isMobileMenuOpen: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,

  reducers: {
    openModal(state) {
      state.isModalOpen = true;
    },

    closeModal(state) {
      state.isModalOpen = false;
    },

    setMobileMenuOpen(state, action) {
      state.isMobileMenuOpen = action.payload;
    },

    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },

    setNotification(state, action) {
      state.notification = action.payload;
    },

    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const {
  openModal,
  closeModal,
  setMobileMenuOpen,
  toggleMobileMenu,
  setNotification,
  clearNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
