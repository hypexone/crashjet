import React from 'react'
import { setShowRules } from './rulesSlice';
import { useDispatch } from 'react-redux';



const Rules = () => {
    const dispatch = useDispatch();

    return (
        <div className='rules'>
            <div className="rule-header">
                <div className="heading">HOW TO PLAY</div>
                <div className="close" onClick={() => dispatch(setShowRules("false"))} >X</div>
            </div>
            <div className="video">
                <iframe width="100%" height="415" src="https://www.youtube.com/embed/9HEkdFzHLHs" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="rule">01. Make a bet, or even two at same time and wait for the round to start.</div>
            <div className="rule">02. Look after the lucky plane. Your win is bet multiplied by a coefficient of lucky plane.</div>
            <div className="rule">03. Cash Out before plane crashed out  and money is yours!</div>
            <div className="rules-footer">
                Detailed rules
            </div>
        </div>
    )
}

export default Rules
