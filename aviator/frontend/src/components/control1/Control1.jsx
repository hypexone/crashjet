import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setAmtBet1, setManualClass1, setAutoClass1, setPlayStatus1,setAutoPlay1, setBet1, setShowAuto1, setAutoCashout1, setAutoRounds1 } from './control1Slice';
import { setBalance, setRoundId } from '../header/headerSlice';
import { setMessage, setMsgClass } from '../message/messageSlice';
import io from 'socket.io-client';
import { useState,useRef } from 'react';
import axios from 'axios';


const socket = io.connect("http://localhost:5000");


const Control1 = () => {
  const [result, setResult] = useState('');
  const [incCheck, setIncCheck] = useState('');
  const [autoCashoutTime, setAutoCashoutTime] = useState(1.01);




  const balance = useSelector(state => state.balance.value);
  const manualClass1 = useSelector((state) => state.control1.manualClass1);
  const autoClass1 = useSelector((state) => state.control1.autoClass1);
  const amtBet1 = useSelector((state) => state.control1.amtBet1);
  const gameStatus1 = useSelector((state) => state.control1.gameStatus1);
  const betInQueue1 = useSelector((state) => state.control1.playStatus1);
  const showAuto1 = useSelector((state) => state.control1.showAuto1);
  const autoplay1 = useSelector((state) => state.control1.autoPlay1);
  const autoRounds1 = useSelector((state) => state.control1.autoRounds1);
  const autoCashout1 = useSelector((state) => state.control1.autoCashout1);

  const bet1 = useSelector((state) => state.control1.bet1);
  const uid = useSelector((state) => state.balance.user);
  const rid = useSelector((state) => state.balance.roundid);
  const url = useSelector((state) => state.balance.url);


  const dispatch = useDispatch();

  const stateRef = useRef();
  stateRef.auto1 = autoplay1;
  stateRef.autoRoundLeft1 = autoRounds1;
  stateRef.autoCash1 = autoCashout1;
  stateRef.current1 = betInQueue1;
  stateRef.autoCashTime1 = autoCashoutTime;

  


  socket.on("Result", (payload) => {
    setResult(payload);
    if(stateRef.auto1 === "true" && stateRef.autoCash1 === "true" && payload >= stateRef.autoCashTime1){
      Cashout1();
    }
  });

  socket.on("RoundID", (payload) => {
    dispatch(setRoundId(payload));
  });


  socket.on("Crash", (payload) => {
    if(stateRef.auto1 === "true" && stateRef.autoRoundLeft1 > 0){
      dispatch(setPlayStatus1("showQCancel"));
      dispatch(setAutoRounds1(stateRef.autoRoundLeft1 - 1))
    }else{
      dispatch(setAutoPlay1("false"));
      dispatch(setAutoClass1("auto-bet"));
      dispatch(setManualClass1("manual-bet"));
    }
    
    // const detail = {
    //   "multipler": result,
    // }
    // updateHistoryOnCrash(uid, rid, detail);
  });

  socket.on("Wait", (payload) => {
    if (payload) {
      if (stateRef.current1 === "showQCancel") {
        // console.log("---------------" + betInQueue1);
        // dispatch(setBet1("true"));
        dispatch(setPlayStatus1(""));

        Bet1();
      }
    }
  });

  const updateBalanceInDB = async (uid, balance) => {
    try {
      const res = await axios.put(url + '/updateBalance', {
        UserId: uid,
        Balance: balance
      });
      console.log("balance is updated!");
    } catch (error) {
      console.log(error);
    }
  };


  const createPlayerRoundHistory = async (uid, roundid, details) => {
    try {
      const res = await axios.put(url + '/updateRoundHistory', {
        UserId: uid,
        RoundID: roundid,
        Details: details,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deletePlayerRoundHistory = async (uid, roundid, details) => {
    try {
      const res = await axios.put(url + '/deleteBetDetails', {
        UserId: uid,
        RoundID: roundid,
        Details: details,
      });
    } catch (error) {
      console.log(error);
    }
  };


  const updateHistoryOnCashout = async (uid, roundid, details) => {
    try {
      const res = await axios.put(url + '/updateRoundPlayerHistoryOnCashout', {
        UserId: uid,
        RoundID: roundid,
        Details: details,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const updateHistoryOnCrash = async (uid, roundid, details) => {
    try {
      const res = await axios.put(url + '/updatePlayerHistoryOnCrash', {
        UserId: uid,
        RoundID: roundid,
        Details: details,
      });
    } catch (error) {
      console.log(error);
    }
  }




  const Autoplay1 = () => {
    if(autoplay1 === "false"){
    dispatch(setAutoClass1("auto-bet2"));
    dispatch(setManualClass1("manual-bet2"));
    dispatch(setShowAuto1("true"));
    dispatch(setAutoRounds1(10));
    }
  }

  const StopAutoplay1 =() => {
    dispatch(setShowAuto1("false"));
    dispatch(setAutoClass1("auto-bet"));
    dispatch(setManualClass1("manual-bet"));
    dispatch(setAutoPlay1("false"));
  }

  const ManualPlay1 = () => {
    if(autoplay1 === "false"){
    dispatch(setAutoClass1("auto-bet"));
    dispatch(setManualClass1("manual-bet"));
    }
  }



  const autoCashoutSwitch1 = () => {
    if (autoCashout1 === "false") {
      dispatch(setAutoCashout1("true"));
      console.log(autoCashout1);
    }
    else {
      dispatch(setAutoCashout1("false"));
      console.log(autoCashout1);
    }
  }

  const Increment1 = () => {
    if (bet1 === "false" && gameStatus1 === "waiting")
      dispatch(setAmtBet1(amtBet1 + 0.1));
  }

  const Decrement1 = () => {
    if (bet1 === "false" && gameStatus1 === "waiting")
      dispatch(setAmtBet1(amtBet1 - 0.1));

  }

  const Bet1 = () => {
    if (amtBet1 <= balance) {
      dispatch(setBet1("true"));
      const newBal = balance - amtBet1;
      updateBalanceInDB(uid, newBal);
      dispatch(setBalance(newBal));

      let date = new Date();
      const details = {
        "roundId": rid,
        "userid": uid,
        "date": date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "-" + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString(),
        "betAmt": amtBet1.toFixed(2),
        "multipler": "-",
        "cashout": "-",
        "betBtn": "btn1",
      }

      createPlayerRoundHistory(uid, rid, details);

    } else {
      dispatch(setMessage("Don't have enough balance! Please recharge."));
      dispatch(setMsgClass("message2"));
      HideMessageBox();
      dispatch(setAutoPlay1("false"));
      dispatch(setAutoClass1("auto-bet"));
    dispatch(setManualClass1("manual-bet"));
    }
  };

  const Cancel1 = () => {
    dispatch(setPlayStatus1(""));

    dispatch(setBet1("false"));
    const newBal = balance + amtBet1;
    dispatch(setBalance(newBal));
    updateBalanceInDB(uid, newBal);

    const detail = {
      "betBtn": "btn1",
    }

    deletePlayerRoundHistory(uid, rid, detail);


  }

  const Cashout1 = () => {
    dispatch(setPlayStatus1(""));

    if(stateRef.auto1 === "true" && stateRef.autoRoundLeft1 > 0){
      dispatch(setPlayStatus1("showQCancel"));
      dispatch(setAutoRounds1(stateRef.autoRoundLeft1 - 1))
    }else{
      dispatch(setAutoPlay1("false"));
      dispatch(setAutoClass1("auto-bet"));
    dispatch(setManualClass1("manual-bet"));
    }

    const cashout = (amtBet1 * result).toFixed(2);
    const detail = {
      "multipler": result,
      "cashout": cashout,
      "betBtn": "btn1",
    }

    dispatch(setBet1('false'));
    updateHistoryOnCashout(uid, rid, detail);
    const newBal = amtBet1 * result + balance;
    dispatch(setBalance(newBal));
    dispatch(setMessage("Cashout: " + cashout + "$"));
    dispatch(setMsgClass("message2"));
    HideMessageBox();
    updateBalanceInDB(uid, newBal);

  }

  const HideMessageBox = () => {
    setTimeout(() => {
      dispatch(setMsgClass('message'));
    }, 2000);
  }

  const counter = () => {
    let timeleft = 10;
    let downloadTimer = setInterval(function () {
      if (timeleft <= 0) {
        clearInterval(downloadTimer);
      }
      document.getElementById("countdown").innerText = 10 - timeleft;
      timeleft -= 1;
    }, 1000);
  }

  const IncOne1 = () => {
    if (bet1 === "false" && gameStatus1 === "waiting") {
      if (incCheck === "one") {
        if (amtBet1 < 100)
          dispatch(setAmtBet1(amtBet1 + 1));
        else {
          dispatch(setMessage("Maximum Bet is 100$"));
          dispatch(setMsgClass("message2"));
          HideMessageBox();
        }
      }
      else {
        setIncCheck("one");
        dispatch(setAmtBet1(1));
      }
    }
  }
  const IncFive1 = () => {
    if (bet1 === "false" && gameStatus1 === "waiting") {
      if (incCheck === "five") {
        if (amtBet1 < 100)
          dispatch(setAmtBet1(amtBet1 + 5));
        else {
          dispatch(setMessage("Maximum Bet is 100$"));
          dispatch(setMsgClass("message2"));
          HideMessageBox();
        }
      }
      else {
        setIncCheck("five");
        dispatch(setAmtBet1(5));
      }
    }
  }
  const IncTen1 = () => {
    if (bet1 === "false" && gameStatus1 === "waiting") {
      if (incCheck === "ten") {
        if (amtBet1 < 100)
          dispatch(setAmtBet1(amtBet1 + 10));
        else {
          dispatch(setMessage("Maximum Bet is 100$"));
          dispatch(setMsgClass("message2"));
          HideMessageBox();
        }
      }
      else {
        setIncCheck("ten");
        dispatch(setAmtBet1(10));
      }
    }
  }
  const IncFifty1 = () => {
    if (bet1 === "false" && gameStatus1 === "waiting") {
      if (incCheck === "fifty") {
        console.log(amtBet1);
        if (amtBet1 < 100)
          dispatch(setAmtBet1(amtBet1 + 50));
        else {
          dispatch(setMessage("Maximum Bet is 100$"));
          dispatch(setMsgClass("message2"));
          HideMessageBox();
        }
      }
      else {
        setIncCheck("fifty");
        dispatch(setAmtBet1(50));
      }
    }
  }

  const QBet1 =()=> {
    dispatch(setPlayStatus1("showQCancel"));
  }
  const QCancel1 =()=> {
    dispatch(setPlayStatus1(""));
  }

  


  const getInputValue = (event)=>{
    // show the user input value to console
    const userValue = event.target.value;
    if(userValue <1){
    setAutoCashoutTime(1.01);
    }else{
      setAutoCashoutTime(userValue);
    }
};

  return (
    <div className="control">
      <div className="bet-auto">
        <span className={manualClass1} onClick={ManualPlay1}>Bet</span>
        <span className={autoClass1} onClick={Autoplay1}>Auto</span>
      </div>
      <div className="coin-btn">
        <div className="coin-plusminus">
          <div className="plusminus">
            <span className="betAmt">{amtBet1.toFixed(2)}$</span>
            <div className="inc-dec">
              <span className="minus" onClick={Decrement1}>-</span>
              <span className="plus" onClick={Increment1}>+</span>
            </div>
          </div>
          <div className="coins">
            <div className="coin-set">
              <div className="coin" onClick={IncOne1}><span>1$</span></div>
              <div className="coin" onClick={IncFive1}><span>5$</span></div>
            </div>
            <div className="coin-set">
              <div className="coin" onClick={IncTen1}><span>10$</span></div>
              <div className="coin" onClick={IncFifty1}><span>50$</span></div>
            </div>
          </div>
        </div>
        <div className={(bet1 === "true") || (bet1 === "false" && gameStatus1 === "started") ? `bet-btn2` : `bet-btn`} onClick={Bet1}><span>BET</span></div>

        <div className={(betInQueue1 === "" && bet1 === "false" && gameStatus1 === "started") ? `bet-btn` : `bet-btn2`} onClick={QBet1}><span>QBET</span></div>
        {/* <div className={(bet1 === "false" && gameStatus1 === "started") ? `bet-btn-disabled` : `bet-btn-disabled2`} >Wait for next round</div> */}
        <div className={(betInQueue1 ==="showQCancel") ? `cancel-div2` : `cancel-div`} onClick={QCancel1}>
          <span>Waiting for next round...</span>
          <div className="cancel"><span>QCANCEL</span></div>
        </div>

        <div className={(bet1 === "true" && gameStatus1 === "started") ? `cashout-btn2` : `cashout-btn`} onClick={Cashout1}>
          <span>CASHOUT</span>
          <span>{(amtBet1 * result).toFixed(2)}$</span>
        </div>
        <div className={(bet1 === "true" && gameStatus1 === "waiting") ? `cancel-div2` : `cancel-div`} onClick={Cancel1}>
          <span>Waiting for next round...</span>
          <div className="cancel"><span>CANCEL</span></div>
        </div>
      </div>
      <div className={autoplay1==="true"?"stopAuto":"stopAuto2"}>
        <span className="stop" onClick={StopAutoplay1} >Stop Auto ({autoRounds1})</span>
        <span>Auto Cashout
          <span className={(autoCashout1 === "false") ? "auto-off" : "auto-on"} onClick={autoCashoutSwitch1}>{autoCashout1 === "false" ? "OFF" : "ON"}</span>
          <input type="number" className="autoCashoutTime" onChange={getInputValue} value={autoCashoutTime}/>x
        </span>

      </div>
    </div>
  )
}

export default Control1
