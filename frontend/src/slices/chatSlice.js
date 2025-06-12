import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    usersAndGroups: [],
    selectedUserOrGroup: null,
};

const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {
        setUsersAndGroups: (state, action) => {
            state.usersAndGroups = action.payload;
        },
        setSlectedUserOrGroup: (state, action) => {
            state.messages = [];
            state.selectedUserOrGroup = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = [...state.messages, ...action.payload];
        },
        resetSelectedUserOrGroup: (state, action) => {
            state.selectedUserOrGroup = null;
            state.messages = [];
            if (action.payload === "logout") {
                state.usersAndGroups = [];
            }
        }
    }
});

export const { setUsersAndGroups, setSlectedUserOrGroup, setMessages, resetSelectedUserOrGroup } = chatSlice.actions;

export default chatSlice.reducer;
