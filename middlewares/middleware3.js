let Listing = require("../models/listing.js");
let isOwner = async(req , res , next)=> {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if (!res.locals.currentUser && res.locals.currentUser._id.equals(listing.owner._id)){
        req.flash("error" , "you don't have the access to change it");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = isOwner;