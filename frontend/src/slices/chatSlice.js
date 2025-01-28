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
            state.selectedUser = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        }
    }
});

export const { setUsers, selectedUser, setMessages } = chatSlice.actions;

export default chatSlice.reducer;
