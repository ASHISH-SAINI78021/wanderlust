const Listing = require("../models/listing.js");

module.exports.index = async (req , res)=> {
    let  allListings = await Listing.find();
    res.render("listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req , res)=> {
    
    // req.flash("success" , "New listing added successfully");
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req ,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews" , populate : {
        path : "author"
    }}).populate("owner");
    if (!listing){
        req.flash("error" , "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing}); 
}

module.exports.createListing = async (req , res)=> {
    // let listing = req.body.listing;  // it will store the javascript objects in it // to use it go and see names in new.ejs
        const url = req.file.path; // it will fetch the path from the cloudinary
        const filename = req.file.filename; // it will fetch the filename from cloudinary
        const listing = new Listing(req.body.listing); // it will directly store data in database
        listing.owner = req.user._id;
        // if (!listing){
        //     next(new ExpressError(400 , "Error from the client side"));
        // }
        // if (!listing.description){
        //     next(new ExpressError(400 , "Description is missing"));
        // }
        // if (!listing.price){
        //     next(new ExpressError(400 , "Price is missing"));
        // }
        // if (!listing.location){
        //     next(new ExpressError(400 , "Location is missing"));
        // }
        // if (!listing.country){
        //     next(new ExpressError(400 , "Country is missing"));
        // }
        listing.image = {url , filename};
        req.flash("success" , "Listing added successfully");
        await listing.save();
        res.redirect("/listings");  
}

module.exports.renderEditForm = async (req , res)=> {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing){
        req.flash("error" , "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/uploads" , "/uploads/h_50,w_50"); 
    res.render("listings/edit.ejs" , {listing , originalImageUrl});
}

module.exports.updateListing = async (req , res)=> {
    let {id} = req.params;
    
    req.flash("success" , "Listing upadated successfully");
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing} , {new : true});
    if (typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename; 
        listing.image = {url , filename};
    }
   
    await listing.save();
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req , res)=> {
    let {id} = req.params;
    req.flash("success" , "Listing deleted successfully");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}