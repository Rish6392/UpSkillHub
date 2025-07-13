import {createSlice} from "@reduxjs/toolkit"

const initialState={ //It tries to load the token from localStorage on app start.
    token:localStorage.getItem("token")? JSON.parse(localStorage.getItem("token")):null,

};

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setToken(state,value){
            state.token = value.payload;
        },
    },
});

export const {settoken} = authSlice.actions;
export default authSlice.reducer;
