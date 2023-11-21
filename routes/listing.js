const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingSchema = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const isLoggedIn = require("../middlewares/middleware1.js");
const isOwner = require("../middlewares/middleware3.js");
const listingControllers = require("../controllers/listings.js");

const {storage} = require("../cloudConfig.js");
// they are used to send files to backend
const multer = require("multer");// it is used to parse the image data
const upload = multer({storage : storage}); // it is used to save data in upload folder in the same directory
            

const router = express.Router({mergeParams : true});
// Creating listingSchema middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
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


// creating a route to handle single path request
router.route("/")
.get( wrapAsync(listingControllers.index))
.post( isLoggedIn , upload.single('listing[images]') , validateListing , wrapAsync(listingControllers.createListing));

router.get("/new" , isLoggedIn , listingControllers.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.delete(isLoggedIn , isOwner , wrapAsync(listingControllers.destroyListing))
.put(isLoggedIn  , upload.single("listing[images]") , isOwner ,  validateListing , wrapAsync(listingControllers.updateListing))


// new route

// edit route
router.get("/:id/edit" , isOwner , wrapAsync(listingControllers.renderEditForm));

module.exports = router;
