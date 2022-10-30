import { createSlice } from "@reduxjs/toolkit";

export const control2Slice = createSlice(
{
    name: 'control2',
    initialState: {
        amtBet2: 1.00,
        manualClass2:  "manual-bet",
        gameStatus2:  "waiting",     
        autoClass2: "auto-bet",
        bet2: "false",
    },
    reducers: {
        setAmtBet2: (state, action) => {
            state.amtBet2 = action.payload
        },
        setManualClass2: (state, action) => {
            state.manualClass2 = action.payload
        },
        setGameStatus2: (state, action) => {
            state.gameStatus2 = action.payload
        },
        setAutoClass2: (state, action) => {
            state.autoClass2 = action.payload
        },
        setBet2: (state, action) => {
            state.bet2 = action.payload
        },
    },
}
)

export const { setAmtBet2 , setManualClass2, setGameStatus2, setAutoClass2, setBet2 } = control2Slice.actions;

export default control2Slice.reducer;