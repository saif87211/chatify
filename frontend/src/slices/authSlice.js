import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authUser: null,
    isRegister: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggingIn = true;
            state.authUser = action.payload;
        },
        logout: () => {
            state.authUser = null;
        }
    }
});

export const { login, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;