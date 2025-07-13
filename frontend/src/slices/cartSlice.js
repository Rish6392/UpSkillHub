import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast"

const initialState={ 
    totalItems:localStorage.getItem("totalitems") ? JSON.parse(localStorage.getItem("totalItems")):0
};

const cartSlice = createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setTotalItems(state,value){
            state.token = value.payload;
        },
        // add to cart
        //remove from cart
        //reset cart
    },
});

export const {setTotalItems} = cartSlice.actions;
export default cartSlice.reducer;