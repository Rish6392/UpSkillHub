
//This is the root reducer, used to combine multiple reducers into one.

import {combineReducers} from "@reduxjs/toolkit";  // Merges multiple reducers into a single one.
import authReducer from "../slices/authSlice"   //  You define a slice of state called auth that is managed by authReducer.

const rootReducer = combineReducers({
  auth:authReducer,
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