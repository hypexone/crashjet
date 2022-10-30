import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAmtBet2, setManualClass2, setAutoClass2, setBet2 } from './control2Slice';
import { setBalance, setRoundId } from '../header/headerSlice';
import { setMessage, setMsgClass } from '../message/messageSlice';
import io from 'socket.io-client';
import { useState } from 'react';
import axios from 'axios';


const socket = io.connect("http://localhost:5000");


const Control2 = () => {
    const [result, setResult] = useState('');
    const [incCheck, setIncCheck] = useState('');



    const balance = useSelector(state => state.balance.value);
    const manualClass2 = useSelector((state) => state.control2.manualClass2);
    const autoClass2 = useSelector((state) => state.control2.autoClass2);
    const amtBet2 = useSelector((state) => state.control2.amtBet2);
    const gameStatus2 = useSelector((state) => state.control2.gameStatus2);
    const bet2 = useSelector((state) => state.control2.bet2);
    const rid = useSelector((state) => state.balance.roundid);
    const uid = useSelector((state) => state.balance.user);
    const url = useSelector((state) => state.balance.url);
    const dispatch = useDispatch();



    socket.on("Result", (payload) => {
        setResult(payload);
    });

    socket.on("RoundID", (payload) => {
        dispatch(setRoundId(payload));
    });

    // socket.on("Crash", (payload) => {
    //     const detail = {
    //         "multipler": result,
    //     }
    //     updateHistoryOnCrash(uid, rid, detail);
    // });



    const updateBalanceInDB = async (uid, balance) => {
        try {
            const res = await axios.put(url + '/updateBalance', {
                UserId: uid,
                Balance: balance
            });
            console.log("balance is updated!");
            //   console.log(res.data);
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



    const Autoplay2 = () => {
        dispatch(setAutoClass2("auto-bet2"));
        dispatch(setManualClass2("manual-bet2"));

    }

    const ManualPlay2 = () => {
        dispatch(setAutoClass2("auto-bet"));
        dispatch(setManualClass2("manual-bet"));
    }

    const Increment2 = () => {
        if (bet2 === "false" && gameStatus2 === "waiting")
            dispatch(setAmtBet2(amtBet2 + 0.1));
    }

    const Decrement2 = () => {
        if (bet2 === "false" && gameStatus2 === "waiting")
            dispatch(setAmtBet2(amtBet2 - 0.1));

    }

    const Bet2 = () => {
        if (amtBet2 <= balance) {
            dispatch(setBet2("true"));
            const newBal = balance - amtBet2;
            updateBalanceInDB(uid, newBal);
            dispatch(setBalance(newBal));

            let date = new Date();
            const details = {
                "roundId": rid,
                "userid": uid,
                "date": date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "-" + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString(),
                "betAmt": amtBet2.toFixed(2),
                "multipler": "-",
                "cashout": "-",
                "betBtn": "btn2",
            }

            createPlayerRoundHistory(uid, rid, details);

        } else {
            dispatch(setMessage("Don't have enough balance! Please recharge."));
            dispatch(setMsgClass("message2"));
            HideMessageBox();
        }

    };

    const Cancel2 = () => {
        dispatch(setBet2("false"));
        const newBal = balance + amtBet2;
        dispatch(setBalance(newBal));
        updateBalanceInDB(uid, newBal);
        const detail = {
            "betBtn": "btn2",
          }
        deletePlayerRoundHistory(uid, rid, detail);
    }

    const Cashout2 = () => {
        const cashout = (amtBet2 * result).toFixed(2);
    const detail = {
      "multipler": result,
      "cashout": cashout,
      "betBtn": "btn2",
    }
        dispatch(setBet2('false'));
        updateHistoryOnCashout(uid, rid, detail);
        const newBal = amtBet2 * result + balance;
        dispatch(setBalance(newBal));
        dispatch(setMessage("Cashout: " + cashout + "$"));
        dispatch(setMsgClass("message2"));
        HideMessageBox();
        updateBalanceInDB(uid, newBal);

    }


    const HideMessageBox = () => {
        setTimeout(() => {
            dispatch(setMsgClass('message'));
        }, 3000);
    }


    const IncOne2 = () => {
        if (bet2 === "false" && gameStatus2 === "waiting") {
          if (incCheck === "one") {
            if (amtBet2 < 100)
              dispatch(setAmtBet2(amtBet2 + 1));
            else {
              dispatch(setMessage("Maximum Bet is 100$"));
              dispatch(setMsgClass("message2"));
              HideMessageBox();
            }
          }
          else {
            setIncCheck("one");
            dispatch(setAmtBet2(1));
          }
        }
      }
      const IncFive2 = () => {
        if (bet2 === "false" && gameStatus2 === "waiting") {
          if (incCheck === "five") {
            if (amtBet2 < 100)
              dispatch(setAmtBet2(amtBet2 + 5));
            else {
              dispatch(setMessage("Maximum Bet is 100$"));
              dispatch(setMsgClass("message2"));
              HideMessageBox();
            }
          }
          else {
            setIncCheck("five");
            dispatch(setAmtBet2(5));
          }
        }
      }
      const IncTen2 = () => {
        if (bet2 === "false" && gameStatus2 === "waiting") {
          if (incCheck === "ten") {
            if (amtBet2 < 100)
              dispatch(setAmtBet2(amtBet2 + 10));
            else {
              dispatch(setMessage("Maximum Bet is 100$"));
              dispatch(setMsgClass("message2"));
              HideMessageBox();
            }
          }
          else {
            setIncCheck("ten");
            dispatch(setAmtBet2(10));
          }
        }
      }
      const IncFifty2 = () => {
        if (bet2 === "false" && gameStatus2 === "waiting") {
          if (incCheck === "fifty") {
            console.log(amtBet2);
            if (amtBet2 < 100)
              dispatch(setAmtBet2(amtBet2 + 50));
            else {
              dispatch(setMessage("Maximum Bet is 100$"));
              dispatch(setMsgClass("message2"));
              HideMessageBox();
            }
          }
          else {
            setIncCheck("fifty");
            dispatch(setAmtBet2(50));
          }
        }
      }

    return (
        <div className="control">
            <div className="bet-auto">
                <span className={manualClass2} onClick={ManualPlay2}>Bet</span>
                <span className={autoClass2} onClick={Autoplay2}>Auto</span>
            </div>
            <div className="coin-btn">
                <div className="coin-plusminus">
                    <div className="plusminus">
                        <span className="betAmt">{amtBet2.toFixed(2)}$</span>
                        <div className="inc-dec">
                            <div className="minus" onClick={Decrement2}>-</div>
                            <span className="plus" onClick={Increment2}>+</span>
                        </div>
                    </div>
                    <div className="coins">
                        <div className="coin-set">
                            <div className="coin" onClick={IncOne2}><span>1$</span></div>
                            <div className="coin" onClick={IncFive2}><span>5$</span></div>
                        </div>
                        <div className="coin-set">
                            <div className="coin" onClick={IncTen2}><span>10$</span></div>
                            <div className="coin" onClick={IncFifty2}><span>50$</span></div>
                        </div>
                    </div>
                </div>
                <div className={(bet2 === "true") || (bet2 === "false" && gameStatus2 === "started") ? `bet-btn2` : `bet-btn`} onClick={Bet2}><span >BET</span></div>
                <div className={(bet2 === "false" && gameStatus2 === "started") ? `bet-btn-disabled` : `bet-btn-disabled2`}><span>Wait for next round</span></div>

                <div className={(bet2 === "true" && gameStatus2 === "started") ? `cashout-btn2` : `cashout-btn`} onClick={Cashout2}>
                    <span>CASHOUT</span>
                    <span>{(amtBet2 * result).toFixed(2)}$</span>
                </div>
                <div className={(bet2 === "true" && gameStatus2 === "waiting") ? `cancel-div2` : `cancel-div`} onClick={Cancel2}>
                    <span>Waiting for next round...</span>
                    <div className="cancel"><span>CANCEL</span></div>
                </div>
            </div>
        </div>
    )
}

export default Control2
