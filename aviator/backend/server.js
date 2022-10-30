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



mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected');
}).catch(err => console.log(err));


let check = true;
let wait = true;
let rId;


//Generate random number between 100 to 5000
function GetRandomInteger(min, max,) {
    let x = (Math.floor(Math.random() * (max - min + 1)) + min) / 100;
    console.log(x + "  random no.");
    return x;
}


//create new Round
async function CreateNewRound() {
    let date = new Date();
    let roundid = date.getDate().toString()+ (date.getMonth()+ 1).toString() + date.getFullYear().toString() + "-" + date.getHours().toString()+date.getMinutes().toString()+date.getSeconds().toString();
    rId = roundid;

    io.emit('RoundID', roundid);

    console.log(roundid + "--------------------------");
    const roundData = await RoundData({
        roundId :  roundid ,
        totalBets: 0,
        crashedAt: "-",

    });
    
    roundData.save().then(() => {
        // console.log(roundData);
    }).catch(err => console.log(err));
}


async function updateCrashedAt(rid, crashTime) {
    
    const update = await RoundData.updateOne({roundId: rid},
        {
            $set : {
                crashedAt : crashTime,
            }
        })
}

async function updateTotalBets(rid) {
    const update = await RoundData.findOne({roundId: rid})
try{
    let pet = update;
    // console.log(pet.betsDetails.length);
    io.emit('Total', pet.betsDetails.length);
}catch(err){

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
    const probability = GetRandomInteger(100, 1000);
    let result;
    if(probability <= 5){ 
        // 50% chance to crash below 1.3x
        result= GetRandomInteger(100, 130);
    }else if (probability > 5 && probability <= 7){ 
        // 20% chance to crash b/w 1.3x and 2x
        result= GetRandomInteger(130, 200);
    }else if (probability > 7 && probability <= 8.5){ 
        // 15% chance to crash b/w 2x and 3x
        result= GetRandomInteger(200, 300);
    }else if (probability > 8.5 && probability <= 9.5){ 
        // 10% chance to crash b/w 3x and 5x
        result= GetRandomInteger(300, 500);
    }else{
        // 5% chance to crash b/w 5x and 100x
        result= GetRandomInteger(500, 10000);
    }
    
    let res = 1;

    wait = false; //TODO  emit wait=false
    io.emit('Wait', wait);

    let interval = setInterval(() => {
        let inc;
        if(result)
        res = res + 0.01;
        let m = res.toFixed(2);


        if (m >= result.toFixed(2)) {
            clearInterval(interval);

            io.emit("Crash", "Crashed!");
            io.emit('finalResult', m);
            io.emit('Result', m);
            updateCrashedAt(rId, m);
            SaveResultInDB(m);
            check = true;

        } else {
            if (m > 1.17) {
                io.emit("Greater", "greater");
            }
            io.emit('Result', m);
        }

    }, 50);

    interval;
}


function WaitingForNextRound() {
    wait = true;  //TODO  emit wait=true
    io.emit("Wait", wait);

    setTimeout(() => {
        StartGame();
    }, 10000);
}

io.on("connection", (socket) => {
    console.log("socket is active to be connected");

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


});

server.listen(port, () => {
    console.log("server is listening to port 5000...");
});