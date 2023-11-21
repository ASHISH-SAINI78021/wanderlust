const mongoose = require("mongoose");
const data = require("./data2.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=> {
    console.log("connected to DB");
})
.catch((err)=> {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}
const initDB = async ()=> {
    await Listing.deleteMany({});
    data.data = data.data.map((el)=> ({
        ...el , owner : "6552f38df303128ccf463c96"
    }));
    await Listing.insertMany(data.data); // we are accessing data from data.js
    console.log("data was initialised");
}
initDB();