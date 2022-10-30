import { useState, useEffect } from 'react';
import ListItem from './ListItem';
import { useSelector, useDispatch } from 'react-redux';
import { setRoundId } from '../header/headerSlice';
import axios from 'axios';
import io from 'socket.io-client';
import RoundItem from './RoundItem';

const socket = io.connect("http://localhost:5000");


const Records = () => {
    const [selectedCat, setSelectedCat] = useState("All");
    const [roundRecords, setRoundRecords] = useState([]);
    const [playerRecords, setPlayerRecords] = useState([]);
    const [topRecords, setTopRecords] = useState([]);
    const [recordType, setRecordType] = useState("roundHistory");
    const [total, setTotal] = useState(0);


    const uid = useSelector((state) => state.balance.user);
    const url = useSelector((state) => state.balance.url);
    const rid = useSelector((state) => state.balance.roundid);




    const getPlayerHistory = async (Rid) => {
        try {
            const history = await axios.get(url + `/getHistory/${Rid}`);
            const data = history.data;
            setPlayerRecords(data.reverse());
            // console.log(playerRecords);
        } catch (error) {
            console.log(error);
        }
    }

    const getRoundHistory = async (Rid) => {
        try {
            const history = await axios.get(url + `/getRoundHistory/${Rid}`);
            const data = history.data;
            setRoundRecords(data.reverse());
            // console.log(roundRecords);
        } catch (error) {
            console.log(error);
        }
    }
    

    socket.on("Crash", (payload) => {
        getPlayerHistory(uid);
    });

    socket.on("RoundID", (payload) => {
        setRoundRecords([]);
    });
    socket.on("Total", (payload) => {
        setTotal(payload);
        // console.log(total+"  -----------------  -"+ payload);
    });

    useEffect(() => {
        getPlayerHistory(uid);
    }, [playerRecords]);


    useEffect(() => {
        getRoundHistory(rid);
    }, [roundRecords]);


    const onAllClick = () => {
        setRecordType("roundHistory");
        setSelectedCat("All");
    }

    const onMyClick = () => {
        setRecordType("playerHistory");
        setSelectedCat("My");
        getPlayerHistory(uid);
    }

    const onTopClick = () => {
        setRecordType("topHistory");
        setSelectedCat("Top");
    }

    return (
        <div className="App-records">
            <div className="record-category">
                <span className={`all-bets ${selectedCat === "All" ? "selected-record" : {}}`} onClick={onAllClick}>All Bets</span>
                <span className={`my-bets ${selectedCat === "My" ? "selected-record" : {}}`} onClick={onMyClick}>My Bets</span>
                <span className={`top-bets ${selectedCat === "Top" ? "selected-record" : {}}`} onClick={onTopClick}>Top</span>
            </div>

            {(() => {
                switch (recordType) {
                    case 'roundHistory':
                        return <div className="records">
                            <div className="total">TOTAL BETS: <span className='bet-count'>{total}</span></div>
                            <div className="record-title">
                                <div className='user-item'>User</div>
                                <div className='bet-item'>Bet</div>
                                <div className='multi'>Multi.</div>
                                <div className='cashout-item'>Cash out</div>
                            </div>
                            <div className="record-list">
                                {
                                    roundRecords.length > 0
                                        ?
                                        (roundRecords.reverse().map((record, index) => (
                                            <RoundItem key={index} record={record} />
                                        ))
                                        ) : (<center><h5>No records</h5></center>)
                                }
                            </div>
                        </div>

                    case 'playerHistory':
                        return <div className="records">
                            <div className="record-title">
                                <div className='user-item'>Date/Time</div>
                                <div className='bet-item'>Bet</div>
                                <div className='multi'>Multi.</div>
                                <div className='cashout-item'>Cash out</div>
                            </div>
                            <div className="record-list">
                                {
                                    playerRecords.length > 0
                                        ?
                                        (playerRecords.reverse().map((record, index) => (
                                            <ListItem key={index} record={record} />
                                        ))
                                        ) : (<center><h5>No records</h5></center>)
                                }
                            </div>
                        </div>

                    case 'topHistory':
                        return <div className="records">
                            <div className="record-title">
                                <div className='user-item'>User</div>
                                <div className='bet-item'>Bet</div>
                                <div className='multi'>Multi.</div>
                                <div className='cashout-item'>Cash out</div>
                            </div>
                            <div className="record-list">
                                {
                                    topRecords.length > 0
                                        ?
                                        (topRecords.reverse().map((record, index) => (
                                            <ListItem key={index} record={record} />
                                        ))
                                        ) : (<center><h5>No records</h5></center>)
                                }
                            </div>
                        </div>
                    default:
                        return

                }
            })()}


            <div className="poweredBy">
                <span>This game is Provably Fair</span>
                <span className="power">Powered by DGAMES</span>
            </div>
        </div>
    )
}

export default Records
