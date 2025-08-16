
//This is the root reducer, used to combine multiple reducers into one.

import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice"
import courseReducer from "../slices/courseSlice"
import viewCourseReducer from "../slices/viewCourseSlice"

const rootReducer  = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    viewCourse:viewCourseReducer,
})

export default rootReducer;



// FLOW 
// main.jsx
//  └── Provider (Redux)
//       └── store
//            └── configureStore({ reducer: rootReducer })
//                 └── rootReducer (combineReducers)
//                      └── auth: authReducer
//                           └── authSlice with token state & settoken reducer