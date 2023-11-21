const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req , res)=> {
    let listing = await Listing.findById(req.params.id);
    let newReview =  Review(req.body.review);
    req.flash("success" , "Review added successfully");
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview = async(req , res)=> {
    let {id , reviewId} = req.params;
    req.flash("success" , "Review deleted successfully");
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}}); // it means , it basically checks the required id and delete that id from the database
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}