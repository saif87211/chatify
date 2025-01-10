import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authStatus: false,
    authUserData: null,
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        login: (state, action) => {
            state.authStatus = true;
            state.authUserData = action.payload;
        },
        logout: (state, action) => {
            state.authStatus = false;
            state.authUserData = null;
        }
    }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;