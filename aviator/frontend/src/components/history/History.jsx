import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';






const History = () => {

  const [preResult, setPreResult] = useState([]);


  const url = useSelector((state) => state.balance.url);



  async function getPreResults() {
    try {
      const res = await axios.get(url + '/getPreviousResults');
      console.log("results fectehd!");
      // console.log(res.data.);
      setPreResult(res.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() =>{
    setTimeout(() => {
      getPreResults();
    }, 1000);
    
  },[preResult]);


  // socket.on("finalResult", (payload) => {
  //   preResult.unshift({"multiplier" : payload});
  //   console.log(preResult);
  // })

  return (
    <div className="App-history">
      {preResult.map((i, index) => (<div key={index} className={i.multiplier>2?`history`:`history2`}>{i.multiplier}x</div>))}

    </div>
  )
}

export default History
