import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice.js";

const store = configureStore({
    reducer: authSlice
});

export default store;