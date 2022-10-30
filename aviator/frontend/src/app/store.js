import { configureStore } from '@reduxjs/toolkit';
import balanceReducer from '../components/header/headerSlice';
import control1Reducer from '../components/control1/control1Slice';
import control2Reducer from '../components/control2/control2Slice';
import displayReducer from '../components/display/displaySlice';
import messageReducer from '../components/message/messageSlice';
import ruleReducer from '../components/rules/rulesSlice';
import menuReducer from '../components/menu/menuSlice';


export default configureStore({
    reducer: {
        balance: balanceReducer,
        display: displayReducer,
        control1: control1Reducer,
        control2: control2Reducer,
        message: messageReducer,
        rule: ruleReducer,
        menu: menuReducer,
    }
});