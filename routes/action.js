const express = require('express');

const UserData = require('../models/userData');
const GameData = require('../models/gameData');
const RoundData = require('../models/roundData');
const router = express.Router();


//player Balance  
router.post("/createBalance", async (req, res) => {
    try {
        const newUser = new UserData({
            userId: req.body.UserId,
            balance: req.body.Balance,
        });

        console.log(newUser);
        const user = await newUser.save();
        console.log("here1");

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error);
    }
});




router.put("/updateBalance", async (req, res) => {
    try {
        const id = req.body.UserId;
        const newBal = req.body.Balance;

        console.log(id, newBal);
        const update = await UserData.updateOne({ 'userId': id }, { '$set': { 'balance': newBal } });

        res.status(200).json(update);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/getBalance/:uid", async (req, res) => {
    try {
        const id = req.params.uid;

        const userBal = await UserData.findOne({ 'userId': id });

        res.status(200).json(userBal.balance);
        // console.log(id , userBal);

    } catch (error) {
        res.status(500).json(error);
    }
});





/// Player history  and  round create
router.put("/updateRoundHistory", async (req, res) => {
    try {
        const uid = req.body.UserId;
        const roundid = req.body.RoundID;
        const detail = req.body.Details;

        console.log(uid, roundid, detail);

        const update = await UserData.updateOne({ 'userId': uid }, {
            $push: {
                "history": {
                    "roundId": detail.roundId,
                    "date": detail.date,
                    "betAmt": detail.betAmt,
                    "multipler": detail.multipler,
                    "cashout": detail.cashout,
                    "betBtn": detail.betBtn,
                }
            }
        });

        await RoundData.updateOne({ 'roundId': roundid },
            {
                $push: {
                    "betsDetails": {
                        "userId": detail.userid,
                        "date": detail.date,
                        "betAmt": detail.betAmt,
                        "multipler": detail.multipler,
                        "cashout": detail.cashout,
                        "betBtn": detail.betBtn,
                    }
                }
            });

        res.status(200).json(update);

    } catch (error) {
        res.status(500).json(error);
    }
});


// Delete cancel bet  details from playerhistory and roundid
router.put("/deleteBetDetails", async (req, res) => {
    try {
        const uid = req.body.UserId;
        const roundid = req.body.RoundID;
        const detail = req.body.Details;
       
        const update = await RoundData.updateOne({ roundId: roundid },
            {
                $pull: {
                    betsDetails: {
                        userId: uid,
                        betBtn: detail.betBtn,
                    }
                }
            });

        await UserData.updateOne({ 'userId': uid }, {
            $pull: {
                history: {
                    roundId: roundid,
                    betBtn: detail.betBtn,
                }
            }
        });

        res.status(200).json(update);

    } catch (error) {
        res.status(500).json(error);
    }
});



// Get player history
router.get("/getHistory/:uid", async (req, res) => {
    try {
        const id = req.params.uid;

        const user = await UserData.findOne({ 'userId': id });

        res.status(200).json(user.history);

    } catch (error) {
        res.status(500).json(error);
    }
});




//game Previous Results

router.get("/getPreviousResults", async (req, res) => {
    try {

        const gData = await GameData.findOne({});

        res.status(200).json(gData.previousResults);

    } catch (error) {
        res.status(500).json(error);
    }
});





//get round Details

router.get("/getRoundHistory/:roundid", async (req, res) => {
    try {
        const id = req.params.roundid;

        const round = await RoundData.findOne({ 'roundId': id });

        res.status(200).json(round.betsDetails);

    } catch (error) {
        res.status(500).json(error);
    }
});



//update round and player history on cashout

router.put("/updateRoundPlayerHistoryOnCashout", async (req, res) => {
    try {
        const uid = req.body.UserId;
        const roundid = req.body.RoundID;
        const detail = req.body.Details;

        

        const update = await UserData.updateOne(
            {
                'userId': uid,
                'history': { '$elemMatch': { "roundId": roundid, "betBtn": detail.betBtn } }
            },
            {
                $set: {
                    "history.$.multipler": detail.multipler,
                    "history.$.cashout": detail.cashout,
                }
            }
        );

        await RoundData.updateOne(
            { 
                'roundId': roundid,
                'betsDetails': { '$elemMatch': { "userId": uid, "betBtn": detail.betBtn } }
             },
            {
                $set: {
                        "betsDetails.$.multipler": detail.multipler,
                        "betsDetails.$.cashout": detail.cashout,
                    }
                }
            );

        res.status(200).json(update);

    } catch (error) {
        res.status(500).json(error);
    }
});



//update  player history on crashed

router.put("/updatePlayerHistoryOnCrash", async (req, res) => {
    try {
        const uid = req.body.UserId;
        const roundid = req.body.RoundID;
        const detail = req.body.Details;

      

        const update = await UserData.updateOne(
            {
                'userId': uid,
                'history': { '$elemMatch': { "roundId": roundid } }
            },
            {
                $set: {
                    "history.$.multipler": detail.multipler,
                }
            }
        );


        res.status(200).json(update);

    } catch (error) {
        res.status(500).json(error);
    }
});






module.exports = router;