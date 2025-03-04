import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authStatus: false,
    authUserData: null,
    onlineUsers: []
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
            state.socket = null;
        },
        setOnlineUsers: (state, action) => {
            if (state.authStatus) {
                state.onlineUsers = action.payload;
            }
        }
    }
});

export const { login, logout, setOnlineUsers } = authSlice.actions;

export default authSlice.reducer;