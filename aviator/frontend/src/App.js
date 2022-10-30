import './App.css';
import axios from 'axios';
import Header from './components/header/Header';
import Records from './components/records/Records';
import History from './components/history/History';
import Display from './components/display/Display';
import Control1 from './components/control1/Control1';
import Control2 from './components/control2/Control2';
import Message from './components/message/Message';
import Rules from './components/rules/Rules';
import { useSelector, useDispatch} from 'react-redux';
import { useEffect, useState } from 'react';
import Menu from './components/menu/Menu';
import { setShowRules } from './components/rules/rulesSlice';
import { setBalance } from './components/header/headerSlice';
import bgSfx from './assets/bgmusic.mp3';
import useSound from 'use-sound';
import Auto from './components/auto/Auto';



// const socket = io.connect("http://localhost:5000");

function App() {
  const showRules = useSelector((state) => state.rule.showRules);
  const showMenu = useSelector((state) => state.menu.showMenu);
  const uid = useSelector((state) => state.balance.user);
  const url = useSelector((state) => state.balance.url);
  const sound = useSelector((state) => state.menu.sound);
  const music = useSelector((state) => state.menu.music);
  const showAuto1 = useSelector((state) => state.control1.showAuto1);

  const dispatch = useDispatch();
  const soundUrl = '/assets/bgmusic.mp3';

  const getBalanceFromDB = async (uid) => {
    try {
      const res = await axios.get(url + `/getBalance/${uid}`);
      dispatch(setBalance(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  getBalanceFromDB(uid);
   
 


  // socket.on("Greater", (payload) => {
  //   setInstructionClass("instruction4");
  // });

  // socket.on("Result", (payload) => {
  //   setResult(payload);
  // });
 
  const [playbackRate, setPlaybackRate] = useState(1);

  const [play, { stop }] = useSound(bgSfx, {
    playbackRate,
    volume: 0.2,
  });

  const playMusic = () => {
    play();
 
  };

  
  // playMusic();
  
    if(music === "true"){ stop();
      playMusic(); }
    else{ stop() }

  
 
  return (
    <div className="App" >
            
     
      <div className={(showRules === "true") ? `rules-box` : `rules-box2`} onClick={()=> dispatch(setShowRules("false"))}>
        <Rules />
      </div>
      <Header />
      <div className={(showMenu === "true") ? `menu-box` : `menu-box2`}>
        <Menu />
      </div>
      <div className="message-box">
        <Message /> 
      </div>

      <div className={(showAuto1 ==="true")?`auto-box`:`auto-box2`}>
        <Auto />
      </div>
      <div className="App-features">
        <div className="App-play-area">
          <History />
          <Display />
          <div className="App-controls">
            <Control1 />
            <Control2 />
          </div>
        </div>
        <Records />
      </div>
    </div>
  );
}

export default App;
