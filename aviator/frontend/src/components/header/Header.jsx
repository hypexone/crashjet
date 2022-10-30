import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setShowRules } from '../rules/rulesSlice';
import { setShowMenu } from '../menu/menuSlice';

const Header = () => {
    const balance = useSelector((state) => state.balance.value);
    const showMenu = useSelector((state) => state.menu.showMenu);
    const dispatch = useDispatch();


    const showAndHideMenu = () => {
        if (showMenu === "true") {
            dispatch(setShowMenu("false"))
        } else {
            dispatch(setShowMenu("true"))
        }
    }

    return (
        <header className="App-header">
            <div className="logo">Crash Jet</div>
            <div className="header-option">
                <div className="howToPlay" onClick={() => dispatch(setShowRules("true"))}>
                    <span className="ques">?</span>
                    <span className='htp-text'>How to play?</span>
                </div>
                <div className="balance">
                    <span>{balance.toFixed(2)}</span>
                    <span>$</span>
                </div>
                <div className="menu-icon" onClick={showAndHideMenu}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>

            </div>
        </header>
    )
}

export default Header
