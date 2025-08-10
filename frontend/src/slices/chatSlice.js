import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    usersAndGroups: [],
    selectedUserOrGroup: null,
    isLoading: true,
    groupData: null,
    selectedUsersForGroup: []
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
        },
        setGroupData: (state, action) => {
            state.groupData = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setSelectedUsersForGroup: (state, action) => {
            state.selectedUsersForGroup = action.payload;
        },
    }
});

export const { setUsersAndGroups,
    setSlectedUserOrGroup, setMessages,
    setSelectedUsersForGroup,
    resetSelectedUserOrGroup, setIsLoading,
    setGroupData } = chatSlice.actions;

export default chatSlice.reducer;
