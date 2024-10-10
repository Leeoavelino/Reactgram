import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import useReducer from './slices/useSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: useReducer,
    },

})