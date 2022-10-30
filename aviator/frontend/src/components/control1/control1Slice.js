import { createSlice } from "@reduxjs/toolkit";

export const control1Slice = createSlice(
{
    name: 'control1',
    initialState: {
        amtBet1: 1.00,
        manualClass1:  "manual-bet",
        gameStatus1:  "waiting",  
        playStatus1: "",
        autoClass1: "auto-bet",
        bet1: "false",
        showAuto1: "false",
        autoRounds1: 10,
        autoPlay1: "false",
        autoCashout1: "false",
    },
    reducers: {
        setAmtBet1: (state, action) => {
            state.amtBet1 = action.payload
        },
        setManualClass1: (state, action) => {
            state.manualClass1 = action.payload
        },
        setGameStatus1: (state, action) => {
            state.gameStatus1 = action.payload
        },
        setPlayStatus1: (state, action) => {
            state.playStatus1 = action.payload
        },
        setAutoClass1: (state, action) => {
            state.autoClass1 = action.payload
        },
        setBet1: (state, action) => {
            state.bet1 = action.payload
        },
        setShowAuto1: (state, action) => {
            state.showAuto1 = action.payload
        },
        setAutoRounds1: (state, action) => {
            state.autoRounds1 = action.payload
        },
        setAutoPlay1:(state, action) => {
            state.autoPlay1 = action.payload
        },
        setAutoCashout1:(state, action) => {
            state.autoCashout1 = action.payload
        },
        
    },
}
)

export const { setAmtBet1 , setManualClass1, 
    setGameStatus1, setPlayStatus1, setCancelClass1, 
    setBetClass1, setAutoClass1, setBet1, setShowAuto1, 
    setAutoRounds1, setAutoPlay1, setAutoCashout1
} = control1Slice.actions;

export default control1Slice.reducer;