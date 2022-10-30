import { createSlice } from '@reduxjs/toolkit'

export const displaySlice = createSlice(
{
    name: 'display',
    initialState: {
      flewClass: 'dynamic-text11',
      instructionClass: 'instruction2',
      waitClass: 'dynamic-text22',
    },
    reducers: {
      setFlewClass: (state, action) => {
        state.flewClass = action.payload
      },
      setInstructionClass: (state, action) => {
        state.instructionClass = action.payload
      },
      setWaitClass: (state, action) => {
        state.waitClass = action.payload
      },
    },
  }
  
)


export const { setFlewClass, setInstructionClass, setWaitClass } = displaySlice.actions

export default displaySlice.reducer