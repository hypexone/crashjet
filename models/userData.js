const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        require: true,
    },
    history: [
        {
            roundId: String,
            date: String,
            betAmt: String,
            multipler: String,
            cashout: String,
            betBtn: String,
        }
    ]

    

});

const UserData = mongoose.model('userData', userDataSchema);
module.exports = UserData;