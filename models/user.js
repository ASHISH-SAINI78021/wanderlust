const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type : String , 
        required : true
    }
});
userSchema.plugin(passportLocalMongoose); // it will automatically does the hashing , salting and add username and password to userSchema
const User = mongoose.model("User" , userSchema);

module.exports = User;
