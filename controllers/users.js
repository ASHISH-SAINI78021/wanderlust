const User = require("../models/user.js");

module.exports.signup = async(req , res)=> {
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser , (err)=> {
            if (err){
                return next(err);
            }
            req.flash("success" , "Welcome to wanderlust");
            res.redirect("/listings");
        })
       
    }
    catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm = (req , res)=> {
    req.flash("success" , "Welcome to wanderlust , you are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req , res , next)=> {
    req.logout((err)=> {
        return next(err);
    });
    req.flash("success" , "You are successfully logged out!");
    res.redirect("/listings");
}