import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: localStorage.getItem("chat-theme") || "light",
}

const themeSlice = createSlice({
    name: "themeSlice",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem("chat-theme", state.theme);
        }
    }
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;