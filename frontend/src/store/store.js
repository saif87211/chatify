import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice.js";
import themeSlice from "../slices/themeSlice.js";

const store = configureStore({
    reducer: {
        authSlice,
        themeSlice
    }
});

export default store;