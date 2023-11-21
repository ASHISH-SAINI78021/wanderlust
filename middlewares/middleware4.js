let Review = require("../models/review.js");
let listing = require("../models/listing.js");
let isReviewAuthor = async(req , res , next)=> {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.currentUser._id)){
        req.flash("error" , "you don't have the access to change it");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = isReviewAuthor;