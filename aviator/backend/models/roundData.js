const mongoose = require('mongoose');


const roundDataSchema = new mongoose.Schema({
    roundId : {
        type: String,
        required: true,
    },
    totalBets: {
            type: Number,
        },
    crashedAt: {
        type: String,
    },
    betsDetails: [
        {
            userId: String,
            date: String,
            betAmt: String,
            multipler: String,
            cashout: String,
            betBtn: String,
        }
    ],
    
});

const RoundData = mongoose.model('roundData', roundDataSchema);
module.exports = RoundData;