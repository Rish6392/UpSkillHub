
//This is the root reducer, used to combine multiple reducers into one.

import {combineReducers} from "@reduxjs/toolkit";  // Merges multiple reducers into a single one.
import authReducer from "../slices/authSlice"   //  You define a slice of state called auth that is managed by authReducer.
import profileReducer from "../slices/profileSlice"
import cartReducer from "../slices/cartSlice"
import courseReducer from "../slices/courseSlice" // This slice manages the state related to courses, such as adding, updating, and deleting courses.


const rootReducer = combineReducers({
  auth:authReducer,
  profile:profileReducer,
  cart:cartReducer,
  course:courseReducer,
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