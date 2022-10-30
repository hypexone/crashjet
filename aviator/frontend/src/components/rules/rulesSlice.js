import { createSlice } from "@reduxjs/toolkit";

export const rulesSlice = createSlice (
    {
        name: "rule",
        initialState: {
            showRules: "false",
        },
        reducers: {
            setShowRules: (state, action) => {
                state.showRules = action.payload
            },
        },
    }
)

export const { setShowRules } = rulesSlice.actions;
export default  rulesSlice.reducer;