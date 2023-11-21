const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const isLoggedIn = require("../middlewares/middleware1.js");
const isReviewAuthor = require("../middlewares/middleware4.js");
const router = express.Router({mergeParams : true}); // to add the parameters of parent route and child route
// if some routes exist which can use in child route from parent route then we can use mergeParams to use them

const reviewController = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        if (error.details) {
            const errMsg = error.details.map((el) => el.message).join(", ");
            throw new Error(errMsg);
        } else {
            throw new Error("Validation error occurred");
        }
    } else {
        next();
    }
};




// review routes
router.post("/reviews" , isLoggedIn , validateReview ,  wrapAsync(reviewController.createReview));

// delete review route
router.delete("/reviews/:reviewId" , isLoggedIn , isReviewAuthor , wrapAsync(reviewController.destroyReview));


module.exports = router;