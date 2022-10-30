import React from 'react'

const RoundItem = ({record}) => {
  return (
    <div className={record.cashout === "-" ?'list-item':'list-item1'}>
      <div className="user-item">{record.userId}</div>
      <div className="bet-item bet-border" >{record.betAmt}$</div>
      <div className={(record.multipler === "-")?"mult-item1":"mult-item"}>{(record.multipler === '-')? record.multipler : record.multipler +"x"}</div>
      <div className="cashout-item">{record.cashout === "-" ? record.cashout : record.cashout+"$"}</div>
    </div>
  )
}

export default RoundItem
