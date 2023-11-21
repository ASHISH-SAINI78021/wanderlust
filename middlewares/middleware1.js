let isLoggedIn = (req , res , next)=> {
    // this is the function provided by passport to check the user is authenticated or not
    console.log(req.user);
    if (!req.isAuthenticated()){ 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in");
        res.redirect("/login");
    }
    next();
}

module.exports = isLoggedIn;



