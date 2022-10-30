import { createSlice } from '@reduxjs/toolkit'

export const messageSlice = createSlice(
{
    name: 'message',
    initialState: {
        msgClass: 'message',
        message: '',
      
    },
    reducers: {
      setMsgClass: (state, action) => {
        state.msgClass = action.payload
      },
      setMessage: (state, action) => {
        state.message = action.payload
      },
      
    },
  }
  
)


export const { setMessage, setMsgClass } = messageSlice.actions

export default messageSlice.reducer