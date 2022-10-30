
import { useDispatch, useSelector } from 'react-redux';
import { setShowMenu, setMusic, setSound } from './menuSlice';

const Menu = () => {

    const dispatch = useDispatch();
    const uid = useSelector((state) => state.balance.user);
    const sound = useSelector((state) => state.menu.sound);
    const music = useSelector((state) => state.menu.music);

    const soundSwitch = () => {
        if (sound === "true")
            dispatch(setSound("false"));
        else
            dispatch(setSound("true"));
    }

    const musicSwitch = () => {
        if (music === "true")
            dispatch(setMusic("false"));
        else
            dispatch(setMusic("true"));
    }


    return (
        <div className='menu-options'>
            
            <div className="user-details">
                <div>{uid}</div>
            </div>

            <div className="separator"></div>
            <span className="option">Sound
                <label className={sound === "true" ? "switch2" : "switch"} onClick={soundSwitch}>
                    <span className={sound === "true" ? "slider2" : "slider"}></span>
                </label>
            </span>
            <div className="separator"></div>
            <span className="option">Music
                <label className={music === "true" ? "switch2" : "switch"} onClick={musicSwitch}>
                    <span className={music === "true" ? "slider2" : "slider"}></span>
                </label>
            </span>
            <div className="separator"></div>

            <span className="option">Animation</span>
            <div className="separator"></div>

            <span className="option">Provably Fair Settings</span>
            <div className="separator"></div>

            <span className="option">Game Rules</span>
            <div className="separator"></div>

            <span className="option">My Bet History</span>
            <div className="separator"></div>

            <span className="option" onClick={() => dispatch(setShowMenu("false"))}>Close</span>



        </div>
    )
}

export default Menu
