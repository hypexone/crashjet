import { createSlice } from "@reduxjs/toolkit";

export const headerSlice = createSlice({
    name: 'balance',
    initialState: {
        value: 110,
        user: 'kumar',
        url: 'http://localhost:5000',
        roundid: '',
    },
    reducers: {
        setBalance: (state, action) => {
            state.value = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        setRoundId: (state, action) => {
            state.roundid = action.payload
        },
    },
});

export const { setBalance, setUser, setRoundId } = headerSlice.actions;

export default headerSlice.reducer;