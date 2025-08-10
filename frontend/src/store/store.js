import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice.js";
import themeSlice from "../slices/themeSlice.js";
import chatSlice from "../slices/chatSlice.js";

const store = configureStore({
    reducer: {
        authSlice,
        themeSlice,
        chatSlice
    }
});

export default store;