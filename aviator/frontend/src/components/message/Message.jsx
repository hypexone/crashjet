import React from 'react'
import { useSelector } from 'react-redux';
import  { setMessage, setMsgClass } from './messageSlice';

const Message = () => {

    const msgClass = useSelector((state)=> state.message.msgClass);
    const message = useSelector((state)=> state.message.message);

    return (
        <div>
            <div className={msgClass}>{message}</div>
        </div>
    )
}

export default Message
