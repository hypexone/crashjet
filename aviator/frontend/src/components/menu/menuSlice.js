import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice (
    {
        name: "rule",
        initialState: {
            showMenu: "false",
            sound: "true",
            music: "true",
        },
        reducers: {
            setShowMenu: (state, action) => {
                state.showMenu = action.payload
            },
            setSound: (state, action) => {
                state.sound = action.payload
            },
            setMusic: (state, action) => {
                state.music = action.payload
            },
        },
    }
)

export const { setShowMenu, setSound, setMusic } = menuSlice.actions;
export default  menuSlice.reducer;