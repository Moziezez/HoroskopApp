const mongoose = require("mongoose");
const uri = "mongodb+srv://admin-mo:Test123@datescluster.ehvtnbz.mongodb.net/datesDB";
mongoose.connect(uri, { useNewUrlParser: true });

const datesSchema = new mongoose.Schema ({
    name: String,
    year: Number,
    month: Number,
    day: Number,
    hour: Number,
    minute: Number,
    latitude: Number,
    longitude: Number,
    sunsign: String,
    ascendant: String
});

const Timepoint = mongoose.model('Timepoint', datesSchema); // new collection called timepoints

function createEntry(user_dict) {
    const timepoint = new Timepoint({
        name: user_dict.name,
        year: parseInt(user_dict.year),
        month: parseInt(user_dict.month),
        day: parseInt(user_dict.day),
        hour: parseInt(user_dict.hour),
        minute: parseInt(user_dict.minute),
        longitude: parseInt(user_dict.lon),
        latitude: parseInt(user_dict.lat),
        sunsign: user_dict.sunsign.key,
        ascendant: user_dict.asc.Sign.key
    });
    timepoint.save().then(() => console.log("meow"));
}

Timepoint.find();


module.exports = { createEntry };
