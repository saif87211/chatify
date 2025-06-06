import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    users: [],
    selectedUser: null,
};

const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setSlectedUser: (state, action) => {
            state.messages = [];
            state.selectedUser = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = [...state.messages, ...action.payload];
        },
        resetSelectedUser: (state, action) => {
            state.selectedUser = null;
            state.messages = [];
            if (action.payload === "logout") {
                state.users = [];
            }
        }
    }
});

export const { setUsers, setSlectedUser, setMessages, resetSelectedUser } = chatSlice.actions;

export default chatSlice.reducer;
