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
            console.log("action.payload: ", action.payload);
            state.messages = [...state.messages, ...action.payload];
            console.log(state.messages, " :state.messages");
            console.log(state.messages.length, " :state.messages.length");
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
