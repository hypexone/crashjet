const mongoose = require('mongoose');

const gameDataSchema = new mongoose.Schema({
    previousResults: [
        {
            time: String,
            multiplier: Number,
        }
    ]
});

const GameData = mongoose.model('gameData', gameDataSchema);
module.exports = GameData;