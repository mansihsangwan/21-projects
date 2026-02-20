import { configureStore } from "@reduxjs/toolkit";
import menuReducer from './menuSlice'
import cartReducer from './cartSlice'
export const store=configureStore({
    reducer:{
        menu:menuReducer,
        cart:cartReducer
    }
})