const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const GameData = require('./models/gameData');
const RoundData = require('./models/roundData');
const userRoutes = require('./routes/action');
const bodyParser = require('body-parser');

const produce = require("./producer")


const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});

dotenv.config();
let port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(cors());
app.use('/', userRoutes);
app.get("/", (req, res) => res.send('HEllo from  new express'));
app.all("*", (req, res) => res.send("This doesn't exist!"));

let uri = "mongodb://amit:amit@cluster0-shard-00-00.ia7yq.mongodb.net:27017,cluster0-shard-00-01.ia7yq.mongodb.net:27017,cluster0-shard-00-02.ia7yq.mongodb.net:27017/CrashJet?ssl=true&replicaSet=atlas-lhr6uq-shard-0&authSource=admin&retryWrites=true&w=majority"


mongoose.connect( uri , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected');
}).catch(err => console.log(err));


let check = true;
let wait = true;
let rId, roundStat, betStat, crashresult="";


//Generate random number between 100 to 5000
function GetRandomInteger(min, max,) {
    let x = (Math.floor(Math.random() * (max - min + 1)) + min) / 100;
    console.log(x + "  random no.");
    return x;
}


//create new Round
async function CreateNewRound() {
    let date = new Date();
    let roundid = "CRASHJET101" + date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString() + "-" + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
    rId = roundid;
    roundStat = "ROUND_START";
    betStat = "FALSE";
    crashresult="";

    io.emit('RoundID', roundid);

    const event = { gameId: "CRASHJET101", gameName: "CrashJet", tableId: "CRASHJET101", tableName: "CRASHJET101", roundID: rId, roundStatus: roundStat, betStatus: betStat, outcome: crashresult};

    // call the `produce` function and log an error if it occurs
    produce(event).catch((err) => {
        console.error("error in producer: ", err)
    });

    console.log("roundid : " + roundid);
    const roundData = await RoundData({
        roundId: roundid,
        totalBets: 0,
        crashedAt: "-",

    });

    roundData.save().then(() => {
        // console.log(roundData);
    }).catch(err => console.log(err));
}


async function updateCrashedAt(rid, crashTime) {

    const update = await RoundData.updateOne({ roundId: rid },
        {
            $set: {
                crashedAt: crashTime,
            }
        })
}

async function updateTotalBets(rid) {
    const update = await RoundData.findOne({ roundId: rid })
    try {
        let pet = update;
        // console.log(pet.betsDetails.length);
        io.emit('Total', pet.betsDetails.length);
    } catch (err) {

    }

}



//save Result to DB
async function SaveResultInDB(pResult) {
    let date = new Date();

    await GameData.updateOne({},
        {
            $unset: {
                "previousResults.0": 1
            }
        });

    await GameData.updateOne({},
        {
            $pull: {
                "previousResults": null
            }
        });

    GameData.updateOne(
        {
            $push: {
                previousResults: {
                    "time": date,
                    "multiplier": pResult,
                }
            }
        },
        async function (error, success) {
            if (error) {
                console.log(error);
            } else {
                // console.log(success);
            }
        });
}



//  on game start
function StartGame() {

    let result = GetRandomInteger(100, 130);
    crashresult = result.toString();

    roundStat = "NO_MORE_BETS";
    betStat = "FALSE";

    const event = { gameId: "CRASHJET101", gameName: "CrashJet", tableId: "CRASHJET101", tableName: "CRASHJET101", roundID: rId, roundStatus: roundStat, betStatus: betStat, outcome: crashresult};

    // call the `produce` function and log an error if it occurs
    produce(event).catch((err) => {
        console.error("error in producer: ", err)
    });

    // // start the consumer, and log any errors
    // consume().catch((err) => {
    //     console.error("error in consumer: ", err)
    // })

    let res = 1;

    wait = false; //TODO  emit wait=false
    io.emit('Wait', wait);

    let interval = setInterval(() => {
        // let inc;
        // if(result)
        res = res + 0.01;
        let m = res.toFixed(2);


        if (m >= result.toFixed(2)) {
            clearInterval(interval);
            roundStat = "ROUND_END";
            betStat = "FALSE";
        
            const event = { gameId: "CRASHJET101", gameName: "CrashJet", tableId: "CRASHJET101", tableName: "CRASHJET101", roundID: rId, roundStatus: roundStat, betStatus: betStat, outcome: crashresult};
        
            // call the `produce` function and log an error if it occurs
            produce(event).catch((err) => {
                console.error("error in producer: ", err)
            });

            io.emit("Crash", "Crashed!");
            console.log("plane crashed");
            // io.emit('finalResult', m);
            io.emit('Result', m);
            updateCrashedAt(rId, m);
            SaveResultInDB(m);
            check = true;

        } else {
            io.emit('Result', m);
        }

    }, 100);

    interval;
}


function WaitingForNextRound() {
    wait = true;  //TODO  emit wait=true
    io.emit("Wait", wait);

   
    roundStat = "ROUND_START";
    betStat = "TRUE";
    crashresult="";

    const event = { gameId: "CRASHJET101", gameName: "CrashJet", tableId: "CRASHJET101", tableName: "CRASHJET101", roundID: rId, roundStatus: roundStat, betStatus: betStat, outcome: crashresult};

    // call the `produce` function and log an error if it occurs
    produce(event).catch((err) => {
        console.error("error in producer: ", err)
    });

    setTimeout(() => {
        StartGame();
    }, 10000);
}



setInterval(() => {
    updateTotalBets(rId);

    if (check) {
        check = false;

        CreateNewRound();

        setTimeout(() => {
            WaitingForNextRound();
        }, 2000);
    }

}, 1000);

io.on("connection", (socket) => {
    console.log("socket is active to be connected");

});

server.listen(port, () => {
    console.log("server is listening to port 5000...");
});