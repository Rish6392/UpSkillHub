import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from "react-redux"   // Makes Redux store available to all components.
import rootReducer from './reducer/index.js'  // A Redux Toolkit function to create the Redux store.
import {configureStore} from '@reduxjs/toolkit' //  Combines all reducers.
import {Toaster} from "react-hot-toast";

//You create a Redux store using rootReducer.
const store = configureStore({
  reducer:rootReducer,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store ={store}>
      <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
    </Provider>

  </StrictMode>
)
