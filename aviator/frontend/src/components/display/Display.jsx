import React from 'react'
import { useState, useRef } from 'react';
import Wait from '../../assets/wait.gif';
import { useSelector, useDispatch } from 'react-redux';
import { setFlewClass, setInstructionClass, setWaitClass } from './displaySlice';
import io from 'socket.io-client';
import { setAmtBet1, setManualClass1, setGameStatus1, setPlayStatus1, setAutoClass1, setBet1 } from '../control1/control1Slice';
import { setAmtBet2, setManualClass2, setGameStatus2, setAutoClass2, setBet2 } from '../control2/control2Slice';



const socket = io.connect("http://localhost:5000");


const Display = () => {
  const [result, setResult] = useState('');
  const [crashed, setCrashed] = useState('');

  const instructionClass = useSelector((state) => state.display.instructionClass);
  const flewClass = useSelector((state) => state.display.flewClass);
  const waitClass = useSelector((state) => state.display.waitClass);

  const dispatch = useDispatch();

  const bet1 = useSelector((state) => state.control1.bet1);
  const betInQueue1 = useSelector((state) => state.control1.playStatus1);
  const autoplay1 = useSelector((state) => state.control1.autoPlay1);


  const stateRef = useRef();
  stateRef.auto1 = autoplay1;




  socket.on("Crash", (payload) => {
    setCrashed(payload);
    dispatch(setInstructionClass("instruction5"));
    if(stateRef.auto1 === "false"){
      dispatch(setBet1("false"));
    }
    dispatch(setBet2("false"));
  });

  // socket.on("finalResult", (payload) => {
  //   setPreResult(...preResult, payload);

  // })

  socket.on("Wait", (payload) => {
    if (payload) {
      dispatch(setInstructionClass("instruction2"));
      dispatch(setFlewClass("dynamic-text11"));
      dispatch(setWaitClass("dynamic-text22"));
      setCrashed("");

      dispatch(setGameStatus1("waiting"));
     
      dispatch(setGameStatus2("waiting"));

    } else {
      dispatch(setPlayStatus1(""));

      dispatch(setFlewClass("dynamic-text1"));
      dispatch(setWaitClass("dynamic-text2"));
      dispatch(setInstructionClass("instruction3"));

      dispatch(setGameStatus1("started"));

      dispatch(setGameStatus2("started"));
    }
  });




  socket.on("Greater", (payload) => {
    dispatch(setInstructionClass("instruction4"));
  });

  socket.on("Result", (payload) => {
    setResult(payload);
  });

  return (
    <div className="App-display">

      <div className="display-heading">FUN MODE</div>
      <div className={instructionClass}>
        <div className={flewClass}>
          <div className="flew-away">{crashed}</div>
          <div className="result">{result}x</div>
        </div>
        <div className={waitClass}>
          <img src={Wait} alt="waiting..." />
          <div className="waiting">BET NOW. Waiting for the next round...</div>
        </div>
      </div>
    </div>
  )
}

export default Display
