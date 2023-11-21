const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const savedRedirectUrl = require("../middlewares/middleware2.js");
const userController = require("../controllers/users.js");


router.route("/signup")
.get((req , res)=> {
    res.render("users/signup.ejs");
})
.post(wrapAsync(userController.signup));



router.route("/login")
.get((req , res)=> {
    res.render("users/login.ejs");
})
.post(savedRedirectUrl ,  passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}) , userController.renderLoginForm);


// To logout the user
router.get("/logout" , userController.logout);

module.exports = router;