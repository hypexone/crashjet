import React from 'react'
import { setShowAuto1, setManualClass1, setAutoClass1, setAutoRounds1, setAutoPlay1, setPlayStatus1 } from '../control1/control1Slice';
import { useSelector, useDispatch } from 'react-redux';


const Auto = () => {
    const dispatch = useDispatch();
    const autoRounds1 = useSelector((state) => state.control1.autoRounds1);

    return (
        <div className="auto">
            <div className="auto-header">
                <div className="auto-heading">AUTO PLAY OPTIONS</div>
                <div className="close" onClick={() => {
                    dispatch(setShowAuto1("false"));
                    dispatch(setAutoClass1("auto-bet"));
                    dispatch(setManualClass1("manual-bet"));
                }}
                >X</div>
            </div>
            <div className="no-of-round">
                <span>Select Number of Rounds:</span>
                <div className="select-rounds">
                    <span className={(autoRounds1 === 10) ? `selected` : `round`} onClick={() => dispatch(setAutoRounds1(10))}>10</span>
                    <span className={(autoRounds1 === 20) ? `selected` : `round`} onClick={() => dispatch(setAutoRounds1(20))}>20</span>
                    <span className={(autoRounds1 === 50) ? `selected` : `round`} onClick={() => dispatch(setAutoRounds1(50))}>50</span>
                    <span className={(autoRounds1 === 100) ? `selected` : `round`} onClick={() => dispatch(setAutoRounds1(100))}>100</span>
                </div>
            </div>
            <div className="start-auto" onClick={() => {
                dispatch(setAutoPlay1("true"));
                dispatch(setShowAuto1("false"));
                dispatch(setPlayStatus1("showQCancel"));

            }} >START</div>
        </div>
    )
}

export default Auto
