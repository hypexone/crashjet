import axios from 'axios';

const url = "http://localhost:5000";

  // // function  to update Balance
  export const updateBalanceInDB = async (uid, balance) => {
    try {
      const res = await axios.put(url + '/updateBalance', {
        UserId: uid,
        Balance: balance
      });
      console.log("balance is updated!");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  

  // // function  to fetch Balance


  export const getBalanceFromDB = async (uid) => {
    try {
      const res = await axios.get(url + `/getBalance/${uid}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

