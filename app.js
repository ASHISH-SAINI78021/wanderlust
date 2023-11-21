if (process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.secret)

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");
const port = 8080;
const MONGO_URL = process.env.ATLASDB


// creating session for production level
const store = MongoStore.create({
    mongoUrl : MONGO_URL ,
    crypto : {
        secret: process.env.SECRET
    },
    touchAfter : 24 * 60*60 ,
});

// to print the error in mongostore
store.on("error" , ()=> {
    console.log("error in mongo session store" , err);
})

const sessionOptions = {
    store : store ,
    secret : process.env.SECRET ,
    resave : false ,
    saveUninitialised : true ,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000 ,
        maxMsg : 7*24*60*60*1000 ,
        httpOnly : true
    }
}



app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname , "public")));
app.engine("ejs" , ejsMate); // we can use it like 'includes'. make 'layouts' named folder in 'views' and make a file named 'boilerplate' it means that code which exits everywhere
app.use(cookieParser("secretcode")); // It will help the console function to parse the cookie
app.use(session(sessionOptions)); // it helps us to create a session between a user and server
app.use(flash()); // if we want to show a flash message then we use this middleware

app.use(passport.initialize()); // It will intialise the password
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // it means we are storing all user related information in session
passport.deserializeUser(User.deserializeUser()); // we are deleting all the above information



// setting up mongoose
main().then(()=> {
    console.log("Connected to database");
})
.catch((err)=> {
    console.log(err);
});
async function main(){
    // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    await mongoose.connect(MONGO_URL);
}

// listening...
app.listen(port , ()=> {
    console.log("app is listening...");
});

app.use((req , res , next)=> {
    res.locals.added = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// demo user
// app.get("/demouser" , async(req , res)=> {
//     let fakeUser = new User({
//         email : "student@gmail.com" ,
//         username : "delta-student"
//     });


//     const registeredUser = await User.register(fakeUser , "helloworld"); // it will automatically register the user into the database // it will automatically check that username is unique or not
//     res.send(registeredUser);
// });


// making a express-session
// app.get("/register" , (req , res)=> {
//     let {name = "anonymous"} = req.query;
//     req.session.name = name;
//     console.log(req.session.name);
//     req.flash("success" , "User registered successfully"); // It will take two arguments , one is key , second one is message
//     res.send(name); 
// });
// app.get("/hello" , (req , res)=> {
//     res.send(`hello ${req.session.name}`);
// })



// app.get("/test" , (req , res)=> {
//     res.send("this is express session");
// });
// app.get("/reqcount" , (req , res)=> {
//     if (req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }
//     res.send(`you sent request ${req.session.count} times` );
// });




// // sending cookies from the server
// app.get("/getsignedcookies" , (req , res)=> {
//     res.cookie("name" , "Ashish" , {signed : true});
//     console.log(req.signedCookies);
//     res.send("These are signed cookies");
// })


// app.get("/greet" , (req , res)=> {
//     let {name = "anonymous"} = req.cookies;
//     console.log(name);
// });

// app.get("/getcookies" , (req , res)=> {
//     // console.dir(req.cookies); it will print undefined because this function can not parse cookies so , we use a middleware to print this or parse this

//     console.dir(req.cookies);
//     res.cookie("greet" , "hello");
//     res.cookie("MadeIN" , "india");
//     res.send("These are the required cookies");
// });


app.use("/listings" , listingRouter);
app.use("/listings/:id" , reviewRouter );
app.use("/" , userRouter);

// making root route
// app.get("/" , (req , res)=> {
//     res.send("hi , i am groot");
// });

// create new route -> testListing
app.get("/testListing" , wrapAsync(async (req , res)=> {
    let sampleListing = new Listing({
        title : "My new villa" ,
        description : "By the beach" ,
        price : 1200 ,
        location : "Calangute , Goa" ,
        country : "India"
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing"); 
}));




// creating an error
app.all("*" , (req , res , next)=> {
    next(new ExpressError(404 , "Page not found"));
});

// async function error handling
app.use((err , req , res , next)=> {
    let {statusCode = 500 , message = "padhle beta , chuma chati se ghar nahi chalta"} = err;
    console.log(err);
    res.render("error.ejs" , {message});
    
});


