import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import useReducer from './slices/useSlice'
import photoReducer from './slices/photoSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: useReducer,
        photo: photoReducer,
    },

})