const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new Schema({
    title : {
        type : String ,
        required : true 
    } , 
    description : String ,
    image : {
        // type : String ,

        // default : "https://images.unsplash.com/photo-1695264474184-56e65adf126b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" ,
        // // if image is not coming , then we are setting default value

        // set : (v)=> v === "" ? "https://images.unsplash.com/photo-1695264474184-56e65adf126b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" : v,
        // // if image is coming but it's url is empty

        url: String ,
        filename: String
    } ,
    price : Number ,
    location : String ,
    country : String ,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ] ,
    owner : {
        type : Schema.Types.ObjectId ,
        ref : "User"
    }
});

// creating post middlware to delete all reviews with listing
listingSchema.post("findOneAndDelete" , async (listing)=> {
    if (listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;